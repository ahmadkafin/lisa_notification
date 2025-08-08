module.exports = (sequelize, Sequelize) => {
    const IframeClient = sequelize.define('iframe_client', {
        uuid: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        },
        site_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        is_revoked: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        redirect: {
            type: Sequelize.STRING,
            allowNull: true
        },
    }, {
        tableName: "iframe_client",
        timestamps: true,
    });
    IframeClient.schema('pgn');
    return IframeClient;
}