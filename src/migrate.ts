import { MongoClient, ObjectId } from 'mongodb';
import { AppDataSource } from './config/data-source';
import { User } from './entities/User';
import { Product } from './entities/Product';
import { Order } from './entities/Order';
import dotenv from 'dotenv';

dotenv.config();

interface MigrationResult {
    usersMigrated: number;
    productsMigrated: number;
    ordersMigrated: number;
    errors: string[];
}

class Migration {
    private mongoClient: MongoClient;
    private idMap: Map<string, string> = new Map(); // ObjectId MongoDB -> UUID PostgreSQL

    constructor(
        private mongoUri: string,
        private mongoDbName: string
    ) {
        this.mongoClient = new MongoClient(mongoUri);
    }

    async migrate(): Promise<MigrationResult> {
        const result: MigrationResult = {
            usersMigrated: 0,
            productsMigrated: 0,
            ordersMigrated: 0,
            errors: []
        };

        try {
            console.log('🚀 Connexion aux bases de données...');
            await this.mongoClient.connect();
            await AppDataSource.initialize();
            console.log('✅ Connecté à MongoDB et PostgreSQL\n');

            const mongoDb = this.mongoClient.db(this.mongoDbName);

            // ÉTAPE 1: Migrer les produits (pas de dépendances)
            console.log('📦 Migration des produits...');
            await this.migrateProducts(mongoDb, result);

            // ÉTAPE 2: Migrer les utilisateurs
            console.log('\n👥 Migration des utilisateurs...');
            await this.migrateUsers(mongoDb, result);

            // ÉTAPE 3: Migrer les commandes (dépend des users et produits)
            console.log('\n📋 Migration des commandes...');
            await this.migrateOrders(mongoDb, result);

            // RAPPORT FINAL
            console.log('\n' + '='.repeat(50));
            console.log('📊 RÉSULTATS DE LA MIGRATION');
            console.log('='.repeat(50));
            console.log(`✅ Utilisateurs: ${result.usersMigrated}`);
            console.log(`✅ Produits: ${result.productsMigrated}`);
            console.log(`✅ Commandes: ${result.ordersMigrated}`);
            
            if (result.errors.length > 0) {
                console.log(`\n⚠️  ${result.errors.length} erreurs rencontrées`);
                require('fs').writeFileSync(
                    'migration-errors.json',
                    JSON.stringify(result.errors, null, 2)
                );
            }

        } catch (error: any) {
            console.error('❌ Erreur fatale:', error.message);
            result.errors.push(`Fatal: ${error.message}`);
        } finally {
            await this.mongoClient.close();
            await AppDataSource.destroy();
        }

        return result;
    }

    private async migrateProducts(mongoDb: any, result: MigrationResult) {
        const productsCollection = mongoDb.collection('products');
        const products = await productsCollection.find({}).toArray();

        for (const mongoProduct of products) {
            try {
                const product = new Product();
                product.name = mongoProduct.name;
                product.price = mongoProduct.price;
                product.category = mongoProduct.category;
                product.inStock = mongoProduct.inStock;
                product.tags = mongoProduct.tags || [];

                await AppDataSource.manager.save(product);
                result.productsMigrated++;

                // Stocker la correspondance d'ID pour les relations
                this.idMap.set(`product:${mongoProduct._id.toString()}`, product.id);

                if (result.productsMigrated % 10 === 0) {
                    console.log(`   ➜ ${result.productsMigrated} produits migrés...`);
                }
            } catch (error: any) {
                result.errors.push(`Product ${mongoProduct._id}: ${error.message}`);
            }
        }
    }

    private async migrateUsers(mongoDb: any, result: MigrationResult) {
        const usersCollection = mongoDb.collection('users');
        const users = await usersCollection.find({}).toArray();

        for (const mongoUser of users) {
            try {
                const user = new User();
                user.name = mongoUser.name;
                user.email = mongoUser.email;
                user.age = mongoUser.age;
                user.address = mongoUser.address || null;
                user.createdAt = mongoUser.createdAt || new Date();

                const savedUser = await AppDataSource.manager.save(user);
                result.usersMigrated++;

                // Stocker la correspondance d'ID
                this.idMap.set(`user:${mongoUser._id.toString()}`, savedUser.id);

                if (result.usersMigrated % 10 === 0) {
                    console.log(`   ➜ ${result.usersMigrated} utilisateurs migrés...`);
                }
            } catch (error: any) {
                result.errors.push(`User ${mongoUser._id}: ${error.message}`);
            }
        }
    }

    private async migrateOrders(mongoDb: any, result: MigrationResult) {
    const ordersCollection = mongoDb.collection('orders');
    const orders = await ordersCollection.find({}).toArray();

    for (const mongoOrder of orders) {
        try {
            const order = new Order();
            
            // Récupérer l'ID utilisateur PostgreSQL correspondant
            if (mongoOrder.userId) {
                const userId = this.idMap.get(`user:${mongoOrder.userId.toString()}`);
                if (userId) {
                    const user = await AppDataSource.manager.findOne(User, {
                        where: { id: userId }
                    });
                    if (user) {
                        order.user = user;  // Si user trouvé, on l'assigne
                    } else {
                        console.log(`   ⚠️ Utilisateur non trouvé pour userId: ${userId}`);
                        order.user = null;  // Si pas trouvé, on met null
                    }
                } else {
                    console.log(`   ⚠️ Pas de correspondance d'ID pour userId: ${mongoOrder.userId}`);
                    order.user = null;
                }
            } else {
                order.user = null;  // Pas de userId dans la commande MongoDB
            }

            // Transformer les produits pour utiliser les IDs PostgreSQL
            if (mongoOrder.products && Array.isArray(mongoOrder.products)) {
                order.products = mongoOrder.products.map((p: any) => {
                    const productId = this.idMap.get(`product:${p.productId.toString()}`);
                    return {
                        productId: productId || p.productId.toString(),
                        quantity: p.quantity
                    };
                });
            }

            order.total = mongoOrder.total;
            order.status = mongoOrder.status;
            order.orderDate = mongoOrder.orderDate || new Date();

            await AppDataSource.manager.save(order);
            result.ordersMigrated++;

        } catch (error: any) {
            console.error(`   ❌ Erreur commande ${mongoOrder._id}:`, error.message);
            result.errors.push(`Order ${mongoOrder._id}: ${error.message}`);
        }
    }
}
}

// Exécution de la migration
async function main() {
    console.log('🔄 DÉBUT DE LA MIGRATION MONGODB → POSTGRESQL');
    console.log('='.repeat(50));

    const migration = new Migration(
        process.env.MONGODB_URI || 'mongodb://localhost:27017',
        process.env.MONGODB_DB || 'ecommerce'
    );

    await migration.migrate();
}

main().catch(console.error);