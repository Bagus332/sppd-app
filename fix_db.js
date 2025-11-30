const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    }
);

async function fixIndexes() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        const [indexes] = await sequelize.query(`
            SELECT INDEX_NAME 
            FROM INFORMATION_SCHEMA.STATISTICS 
            WHERE TABLE_SCHEMA = '${process.env.DB_NAME}' AND TABLE_NAME = 'users'
            AND INDEX_NAME != 'PRIMARY';
        `);
        
        const uniqueIndexes = [...new Set(indexes.map(i => i.INDEX_NAME))];
        console.log(`Found ${uniqueIndexes.length} indexes to drop.`);

        for (const indexName of uniqueIndexes) {
            console.log(`Dropping index: ${indexName}`);
            await sequelize.query(`DROP INDEX \`${indexName}\` ON users`);
        }

        console.log('All extra indexes dropped. You can now start the server.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

fixIndexes();
