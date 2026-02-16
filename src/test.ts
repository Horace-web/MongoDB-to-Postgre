import { MongoClient } from 'mongodb';
import { Client } from 'pg';

async function test() {
    // Test PostgreSQL avec vos identifiants
    console.log('📦 Test PostgreSQL:');
    const pgClient = new Client({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: '0000',
        database: 'postgres'
    });

    try {
        await pgClient.connect();
        console.log('✅ PostgreSQL connecté !');
        const res = await pgClient.query('SELECT current_database()');
        console.log(`   Base courante: ${res.rows[0].current_database}`);
        await pgClient.end();
    } catch (err) {
        if (err instanceof Error) {
            console.log('❌ PostgreSQL erreur:', err.message);
        } else {
            console.log('❌ PostgreSQL erreur:', err);
        }
    }

    // Test MongoDB
    console.log('\n🍃 Test MongoDB:');
    const mongoClient = new MongoClient('mongodb://localhost:27017');
    
    try {
        await mongoClient.connect();
        console.log('✅ MongoDB connecté !');
        const dbs = await mongoClient.db().admin().listDatabases();
        console.log(`   Bases: ${dbs.databases.map(db => db.name).join(', ')}`);
        await mongoClient.close();
    } catch (err) {
        if (err instanceof Error) {
            console.log('❌ MongoDB erreur:', err.message);
        } else {
            console.log('❌ MongoDB erreur:', err);
        }
    }
}

test();