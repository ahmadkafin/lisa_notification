module.exports = (sequelize, Sequelize, Licenses) => {
    const HistoryLicenses = sequelize.define('history_licenses', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        uuid: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        licenses_uuid: {
            type: Sequelize.STRING,
            references: {
                model: Licenses,
                sourceKey: 'uuid'
            }
        },
        harga_satuan: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        tanggal: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        last_user_input: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    }, {
        tableName: "history_licenses",
        timestamps: true,
    });
    HistoryLicenses.schema('dbo');
    return HistoryLicenses;
}