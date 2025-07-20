require('dotenv').config();

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    process.env.MSSQL_DB,
    process.env.MSSQL_USER,
    process.env.MSSQL_PASS,
    {
        host: process.env.MSSQL_HOST,
        port: process.env.MSSQL_PORT,
        dialect: 'mssql',
        schema: process.env.MSSQL_SCHEMA,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        }
    }
)

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Licenses = require('./Licenses.models')(sequelize, Sequelize);
db.HistoryLicenses = require('./HistoryLicenses.models')(sequelize, Sequelize, db.Licenses);

db.Licenses.hasMany(db.HistoryLicenses, {
    foreignKey: 'licenses_uuid',
    targetKey: 'licenses_uuid',
    sourceKey: 'uuid',
    constraint: false
});

module.exports = db;