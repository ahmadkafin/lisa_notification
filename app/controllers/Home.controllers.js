const models = require('../models');
const sequelize = models.sequelize;
const response = require('../response')
const comRes = response.response;

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getStatus = async (req, res) => {
    try {
        const [result] = await sequelize.query(`
        SELECT
        COUNT(*) AS total_data,
        COUNT(CASE WHEN end_date < CAST(GETDATE() AS DATE) THEN 1 END) AS expired,
        COUNT(CASE WHEN end_date >= CAST(GETDATE() AS DATE)
                    AND end_date <= DATEADD(day, 120, CAST(GETDATE() AS DATE)) THEN 1 END) AS will_expire,
        COUNT(CASE WHEN end_date > DATEADD(day, 120, CAST(GETDATE() AS DATE)) THEN 1 END) AS secure
        FROM dbo.licenses
    `);

        const data = result[0];

        const output = [
            { status: 'expired', count: data.expired, total_data: data.total_data },
            { status: 'will_expire', count: data.will_expire, total_data: data.total_data },
            { status: 'secure', count: data.secure, total_data: data.total_data },
        ];
        return res.status(200).json({
            status: 200,
            data: output
        });
    } catch (e) {
        res.status(500)
            .json(comRes.SERVER_ERROR(e.message));
    }
}