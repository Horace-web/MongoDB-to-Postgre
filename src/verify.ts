import { AppDataSource } from './config/data-source';
import { User } from './entities/User';
import { Product } from './entities/Product';
import { Order } from './entities/Order';

async function verify() {
    await AppDataSource.initialize();

    console.log('🔍 VÉRIFICATION DES DONNÉES MIGRÉES\n');

    // Vérifier les utilisateurs
    const users = await AppDataSource.manager.find(User);
    console.log(`👥 Utilisateurs: ${users.length}`);
    users.forEach(u => {
        console.log(`   - ${u.name} (${u.email}) - Ville: ${u.address?.city}`);
    });

    // Vérifier les produits
    const products = await AppDataSource.manager.find(Product);
    console.log(`\n📦 Produits: ${products.length}`);
    products.forEach(p => {
        console.log(`   - ${p.name} (${p.price}€) - Tags: ${p.tags?.join(', ')}`);
    });

    // Vérifier les commandes
    const orders = await AppDataSource.manager.find(Order, { relations: ['user'] });
    console.log(`\n📋 Commandes: ${orders.length}`);
    orders.forEach(o => {
        console.log(`   - Client: ${o.user?.name} - Total: ${o.total}€ - Status: ${o.status}`);
    });

    await AppDataSource.destroy();
}

verify();