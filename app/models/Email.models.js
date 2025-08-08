module.exports = (sequelize, Sequelize) => {
    const Email = sequelize.define('email', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        uuid: {
            type: Sequelize.UUID,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email_type: {
            type: Sequelize.STRING,
            allowNull: false
        },
    }, {
        tableName: "email",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['uuid']
            },
        ],
    });
    Email.schema('pgn');
    return Email;
}