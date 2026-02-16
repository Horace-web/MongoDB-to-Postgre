# 📦 MongoDB vers PostgreSQL - Migration Tool

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![TypeORM](https://img.shields.io/badge/TypeORM-0.3.x-orange)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6%2B-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

Outil de migration automatisée de MongoDB vers PostgreSQL avec Node.js et TypeORM. Ce projet permet de transférer des données de MongoDB vers PostgreSQL tout en préservant les relations complexes entre les collections.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Arborescence du projet](#-arborescence-du-projet)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Exemple de données](#-exemple-de-données)
- [Scripts disponibles](#-scripts-disponibles)
- [Structure des entités](#-structure-des-entités)
- [Dépannage](#-dépannage)
- [Personnalisation](#-personnalisation)
- [Alternatives](#-alternatives)
- [FAQ](#-faq)
- [Licence](#-licence)

## ✨ Fonctionnalités

- **Migration automatisée** : Transfert des données de MongoDB vers PostgreSQL en une seule commande
- **Mapping intelligent** : Conversion automatique des types de données
  - `ObjectId` → `UUID` PostgreSQL
  - Dates MongoDB → `TIMESTAMP` PostgreSQL
  - Documents imbriqués → `JSONB`
  - Tableaux → `ARRAY` PostgreSQL
- **Préservation des relations** : Gestion des clés étrangères entre collections
  - Relations One-to-Many (utilisateur → commandes)
  - Relations Many-to-One (commandes → utilisateur)
- **Validation intégrée** : Vérification de l'intégrité des données après migration
- **Logs détaillés** : Suivi en temps réel de la progression
- **Gestion d'erreurs** : Rapport d'erreurs avec export JSON
- **Mode debug** : Logs détaillés pour le débogage

## 📦 Prérequis

- **Node.js** 18 ou supérieur
- **PostgreSQL** 15 ou supérieur
- **MongoDB** 6 ou supérieur
- **npm** ou **yarn**
- **Windows/Linux/MacOS**

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/votre-repo/mongodb-to-postgres-migration.git
cd mongodb-to-postgres-migration
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Compiler TypeScript

```bash
npx tsc
```

## 📁 Arborescence du projet

```
mongodb-to-postgres-migration/
│
├── src/
│   ├── entities/               # Entités TypeORM (modèles de données)
│   │   ├── User.ts             # Entité User avec adresse JSONB
│   │   ├── Product.ts          # Entité Product avec tags array
│   │   └── Order.ts            # Entité Order avec relations
│   │
│   ├── config/                  # Fichiers de configuration
│   │   └── data-source.ts       # Configuration TypeORM
│   │
│   ├── migrate.ts               # Script principal de migration
│   ├── migrate-debug.ts         # Version avec logs détaillés
│   ├── verify.ts                 # Script de vérification post-migration
│   └── test.ts                   # Test de connexion aux bases
│
├── .env                          # Variables d'environnement (à créer)
├── .env.example                  # Exemple de fichier .env
├── .gitignore                    # Fichiers ignorés par Git
├── package.json                  # Dépendances et scripts npm
├── tsconfig.json                 # Configuration TypeScript
├── README.md                     # Documentation (ce fichier)
└── migration-errors.json         # Rapport d'erreurs (généré)
```

## ⚙️ Configuration

### 1. Créer le fichier `.env`

```env
# PostgreSQL Configuration
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=TonPassword
PG_DATABASE=mongotopost(exemple)

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=ecommerce(exemple)
```

### 2. Créer la base de données PostgreSQL

```bash
# Connexion à PostgreSQL
psql -U postgres -h localhost

# Créer la base
CREATE DATABASE mongotopost;

# Quitter
\q
```

## 🎯 Utilisation

### Étape 1 : Vérifier les connexions

```bash
npm run test
```

Résultat attendu :
```
📦 Test PostgreSQL:
✅ PostgreSQL connecté !
   Base courante: mongotopost

🍃 Test MongoDB:
✅ MongoDB connecté !
   Bases: admin, config, local, ecommerce
```

### Étape 2 : Lancer la migration

```bash
npm run migrate
```

Résultat attendu :
```
🔄 DÉBUT DE LA MIGRATION MONGODB → POSTGRESQL
==================================================
📦 Migration des produits...
   ➜ 3 produits migrés...

👥 Migration des utilisateurs...
   ➜ 3 utilisateurs migrés...

📋 Migration des commandes...
   ➜ 2 commandes migrées...

==================================================
📊 RÉSULTATS DE LA MIGRATION
==================================================
✅ Utilisateurs: 3
✅ Produits: 3
✅ Commandes: 2
```

### Étape 3 : Vérifier les données migrées

```bash
npm run verify
```

Résultat attendu :
```
🔍 VÉRIFICATION DES DONNÉES MIGRÉES

👥 Utilisateurs: 3
   - Alice Dupont (alice@email.com) - Ville: Paris
   - Bob Martin (bob@email.com) - Ville: Lyon
   - Claire Bernard (claire@email.com) - Ville: Marseille

📦 Produits: 3
   - Laptop Pro (1299.99€) - Tags: ordinateur, portable
   - Smartphone X (899.99€) - Tags: téléphone, 5G
   - Casque Audio (199.99€) - Tags: casque, bluetooth

📋 Commandes: 2
   - Client: Alice Dupont - Total: 1699.97€ - Status: livré
   - Client: Bob Martin - Total: 899.99€ - Status: en cours
```

### Étape 4 : Visualiser avec Prisma Studio (optionnel)

```bash
# Installer Prisma
npm install prisma --save-dev

# Initialiser Prisma
npx prisma init

# Ajouter DATABASE_URL dans .env
echo "DATABASE_URL=postgresql://postgres:0000@localhost:5432/mongotopost" >> .env

# Générer le schéma
npx prisma db pull

# Lancer Prisma Studio
npx prisma studio
```

## 📊 Exemple de données

### Données MongoDB (source)

```javascript
// Collection: users
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "Alice Dupont",
  "email": "alice@email.com",
  "age": 28,
  "address": {
    "street": "123 Rue de Paris",
    "city": "Paris",
    "zipCode": "75001"
  },
  "createdAt": ISODate("2024-01-15T00:00:00Z")
}

// Collection: products
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "name": "Laptop Pro",
  "price": 1299.99,
  "category": "informatique",
  "inStock": true,
  "tags": ["ordinateur", "portable", "professionnel"]
}

// Collection: orders
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "userId": ObjectId("507f1f77bcf86cd799439011"),
  "products": [
    { "productId": ObjectId("507f1f77bcf86cd799439012"), "quantity": 1 },
    { "productId": ObjectId("507f1f77bcf86cd799439014"), "quantity": 2 }
  ],
  "total": 1699.97,
  "status": "livré",
  "orderDate": ISODate("2024-03-15T00:00:00Z")
}
```

### Données PostgreSQL (cible)

```sql
-- Table: user
SELECT id, name, email, address->>'city' as city FROM "user";

-- Résultat :
-- id                                   | name           | email              | city
-- -------------------------------------+----------------+--------------------+--------
-- 123e4567-e89b-12d3-a456-426614174000 | Alice Dupont   | alice@email.com    | Paris
-- 123e4567-e89b-12d3-a456-426614174001 | Bob Martin     | bob@email.com      | Lyon
-- 123e4567-e89b-12d3-a456-426614174002 | Claire Bernard | claire@email.com   | Marseille

-- Table: product
SELECT name, price, tags FROM product;

-- Résultat :
-- name           | price  | tags
-- ---------------+--------+---------------------------
-- Laptop Pro     | 1299.99| {ordinateur,portable}
-- Smartphone X   | 899.99 | {téléphone,5G}
-- Casque Audio   | 199.99 | {casque,bluetooth}
```

## 📜 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run test` | Teste les connexions aux bases de données |
| `npm run migrate` | Lance la migration complète |
| `npm run migrate:debug` | Migration avec logs détaillés |
| `npm run verify` | Vérifie l'intégrité des données migrées |
| `npm run build` | Compile le projet TypeScript |

## 🏗️ Structure des entités

### User.ts
```typescript
@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    age: number;

    @Column("jsonb", { nullable: true })
    address: {
        street: string;
        city: string;
        zipCode: string;
    };

    @OneToMany(() => Order, order => order.user)
    orders: Order[];
}
```

### Product.ts
```typescript
@Entity()
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column("decimal", { precision: 10, scale: 2 })
    price: number;

    @Column()
    category: string;

    @Column()
    inStock: boolean;

    @Column("text", { array: true, nullable: true })
    tags: string[];
}
```

### Order.ts
```typescript
@Entity()
export class Order {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, user => user.orders, { nullable: true })
    @JoinColumn({ name: "userId" })
    user: User | null;

    @Column("jsonb")
    products: Array<{
        productId: string;
        quantity: number;
    }>;

    @Column("decimal", { precision: 10, scale: 2 })
    total: number;

    @Column()
    status: string;
}
```

## 🔧 Dépannage

### Erreur 1 : "Cannot find module './Order'"

**Problème** : Le fichier Order.ts n'est pas trouvé ou mal importé.

**Solution** :
```bash
# Vérifier les fichiers dans le dossier entities
dir src\entities

# Renommer si nécessaire (O majuscule)
ren src\entities\order.ts src\entities\Order.ts
```

### Erreur 2 : "Port 27017 already in use"

**Problème** : Le port MongoDB est déjà utilisé par un autre processus.

**Solution** :
```powershell
# Identifier le processus
netstat -ano | findstr :27017

# Tuer le processus
taskkill /PID <PID> /F
```

### Erreur 3 : "Relation IDs mismatch"

**Problème** : Les commandes utilisent des IDs fictifs qui n'existent pas.

**Solution** : Recréer les commandes avec les vrais IDs MongoDB
```javascript
use ecommerce
db.orders.drop()

const users = db.users.find().toArray()
const products = db.products.find().toArray()

db.orders.insertMany([
  {
    userId: users[0]._id,
    products: [{ productId: products[0]._id, quantity: 1 }],
    total: products[0].price,
    status: "livré",
    orderDate: new Date()
  }
])
```

### Erreur 4 : "Type 'null' is not assignable to type 'User'"

**Problème** : L'entité Order n'accepte pas `null` pour la relation user.

**Solution** : Modifier Order.ts
```typescript
@ManyToOne(() => User, user => user.orders, { nullable: true })
user: User | null;  // Ajouter | null
```

## 🛠️ Personnalisation

### Ajouter une nouvelle collection

1. **Créer l'entité** : `src/entities/NouvelleEntite.ts`
```typescript
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class NouvelleEntite {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    nom: string;

    // Ajoutez vos champs ici
}
```

2. **Ajouter dans data-source.ts**
```typescript
import { NouvelleEntite } from "../entities/NouvelleEntite";

export const AppDataSource = new DataSource({
    // ...
    entities: [User, Product, Order, NouvelleEntite],
});
```

3. **Ajouter la méthode de migration**
```typescript
private async migrateNouvelleEntite(mongoDb: any, result: MigrationResult) {
    const collection = mongoDb.collection('nouvelle_collection');
    const items = await collection.find({}).toArray();

    for (const item of items) {
        const entity = new NouvelleEntite();
        entity.nom = item.nom;
        // Mapping des champs
        await AppDataSource.manager.save(entity);
    }
}
```

### Modifier le mapping des données

Dans `migrate.ts`, adaptez les transformations selon vos besoins :

```typescript
// Exemple : Conversion de date personnalisée
if (mongoProduct.date) {
    product.date = new Date(mongoProduct.date);
}

// Exemple : Renommage de champ
product.nouveauNom = mongoProduct.ancienNom;

// Exemple : Transformation conditionnelle
product.statut = mongoProduct.active ? "actif" : "inactif";
```

## 🔄 Alternatives

Si ce script ne correspond pas à vos besoins, voici d'autres solutions :

| Outil | Type | Description | Lien |
|-------|------|-------------|------|
| **MONGREL** | Python CLI | Spécialisé MongoDB → PostgreSQL | [GitHub](https://github.com/mongrel/mongrel) |
| **FerretDB** | Proxy | Transforme PostgreSQL en MongoDB | [ferretdb.io](https://www.ferretdb.io) |
| **Integrate.io** | ETL SaaS | Solution no-code avec UI | [integrate.io](https://www.integrate.io) |
| **AWS DMS** | Service Cloud | Migration serverless AWS | [aws.amazon.com/dms](https://aws.amazon.com/dms) |
| **pgLoader** | CLI | Outil polyvalent de migration | [pgloader.io](https://pgloader.io) |

## ❓ FAQ

### Q: Puis-je migrer sans perdre les relations ?
**R:** Oui ! Le script utilise une `idMap` pour conserver la correspondance entre les IDs MongoDB et les UUID PostgreSQL, préservant ainsi toutes les relations.

### Q: Que faire si j'ai des millions de documents ?
**R:** Le script peut être optimisé avec :
- `batch insert` (regrouper les insertions)
- Pagination des requêtes MongoDB
- Streams pour éviter la surcharge mémoire

### Q: Comment gérer les erreurs pendant la migration ?
**R:** Le script continue même en cas d'erreur et génère un fichier `migration-errors.json` avec tous les problèmes rencontrés.

### Q: Puis-je tester avant la vraie migration ?
**R:** Oui ! Utilisez une base de test et le flag `DRY_RUN=true` dans `.env`

### Q: Les performances sont-elles bonnes ?
**R:** Pour des volumes modestes (< 100k documents), c'est suffisant. Pour plus, utilisez les optimisations mentionnées.

## 📝 Licence

MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 👨‍💻 Auteur

Développé dans le cadre d'un projet de migration de données MongoDB → PostgreSQL

**Contact** : [votre-email@example.com](mailto:votre-email@example.com)

---

## ⭐ Support

Si ce projet vous a été utile, n'hésitez pas à :
- Mettre une ⭐ sur le dépôt
- Signaler des bugs
- Proposer des améliorations
- Contribuer au code

---

*Dernière mise à jour : 16 février 2026*
