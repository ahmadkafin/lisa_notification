const sequelizePaginate = require('sequelize-paginate');
module.exports = (sequelize, Sequelize) => {
    const Licenses = sequelize.define('licences', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        uuid: {
            type: Sequelize.STRING,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        start_date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        end_date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        volume: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        satuan: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        harga_satuan: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        jumlah: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        password: {
            type: Sequelize.TEXT,
            allowNull: false,
            defaultValue: "password"
        },
        lokasi_lisensi: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: "Jakarta"
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        last_user_input: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    }, {
        tableName: "licenses",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['uuid']
            }
        ]
    });
    Licenses.schema('dbo');
    sequelizePaginate.paginate(Licenses);
    return Licenses;
}