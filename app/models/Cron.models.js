module.exports = (sequelize, Sequelize) => {
    const Cron = sequelize.define('cron', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        uuid: {
            type: Sequelize.UUID,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        time_schedule: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        is_running: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
    }, {
        tableName: "cron",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['uuid']
            }
        ]
    });
    Cron.schema('pgn');
    return Cron;
}