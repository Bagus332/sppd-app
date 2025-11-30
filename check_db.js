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

async function checkIndexes() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        const [indexes] = await sequelize.query(`
            SELECT INDEX_NAME 
            FROM INFORMATION_SCHEMA.STATISTICS 
            WHERE TABLE_SCHEMA = '${process.env.DB_NAME}' AND TABLE_NAME = 'users'
            AND INDEX_NAME != 'PRIMARY';
        `);
        
        console.log('Indexes on users table (excluding PRIMARY):');
        const uniqueIndexes = [...new Set(indexes.map(i => i.INDEX_NAME))];
        console.log(uniqueIndexes);
        console.log(`Total unique non-primary indexes: ${uniqueIndexes.length}`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkIndexes();
