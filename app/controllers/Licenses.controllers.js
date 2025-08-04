const { v4: uuidv4 } = require('uuid');

const models = require('../models')
const service = require('../services')
const common = require('../response');

const comRes = common.response;
const crud = service.crud;
const validation = service.validation;
const payload = service.payload;

const Licenses = models.Licenses;
const HistoryLicenses = models.HistoryLicenses;
const Op = models.Sequelize.Op;

/** 
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.get = async (req, res) => {
    let page = parseInt(req.query.page, 10) || 1;
    let paginate = parseInt(req.query.paginate, 10) || 10;
    let clause = {
        page: page,
        paginate: paginate,
        required: true,
        duplicating: false,
        order: [['end_date', 'DESC']],
        where: {
            [Op.or]: [
                {
                    name: {
                        [Op.like]: `%${req.query.name}%`,
                    }
                }
            ]
        },
        include: [
            {
                model: HistoryLicenses,
                required: true,
                duplicating: false,
            }
        ]
    }
    try {
        // await crud.read(res, Licenses, clause);
        await Licenses.paginate(clause).then((resp) => {
            return res.status(200).json(comRes.SUCCESS(resp));
        })
    } catch (e) {
        res.status(500)
            .json(comRes.SERVER_ERROR(e.message));
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.find = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json(comRes.BAD_REQUEST("req body must be present"));
    }
    let clause = {
        where: {
            uuid: {
                [Op.eq]: req.body.uuid,
            }
        },
        include: [
            {
                model: HistoryLicenses,
                required: true,
            }
        ]
    }
    await crud.read(res, Licenses, clause);
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.create = async (req, res) => {
    const uuid = uuidv4();
    if (!validation.licenses(req)) {
        return res.status(400)
            .json(comRes.BAD_REQUEST("payload is not fullfilled!"));
    }
    let licensesData = payload.licenses(req, uuid);
    await Licenses.create(licensesData).then(async (data) => {
        const uuid = uuidv4();
        let historyLicensesData = payload.historyLicenses(data, uuid);
        await HistoryLicenses.create(historyLicensesData)
            .then((historyData) => {
                res.status(201).json(comRes.CREATED(
                    {
                        licensesData: data,
                        historyData: historyData,
                    }
                ));
            })
    }).catch((err) => {
        res.status(500)
            .json(comRes.SERVER_ERROR(err.message));
    });
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.update = async (req, res) => {
    const { uuid } = req.body;
    const newUuid = uuidv4();
    try {
        const licenseWhere = { where: { uuid: { [Op.eq]: uuid } } };

        const existingLicense = await Licenses.findOne(licenseWhere);

        if (!existingLicense) {
            return res.status(404).json(comRes.NOT_FOUND("Data Not Found"));
        }
        const licenseUpdateData = payload.licenses(req, uuid);

        await Licenses.update(licenseUpdateData, licenseWhere);

        const existingHistory = await HistoryLicenses.findOne({
            where: {
                licenses_uuid: { [Op.eq]: uuid },
                harga_satuan: { [Op.eq]: licenseUpdateData.harga_satuan },
            },
        });

        if (!existingHistory) {
            const historyData = payload.historyLicenses(licenseUpdateData, newUuid);
            await HistoryLicenses.create(historyData);
        }

        return res.status(200).json(comRes.SUCCESS("Updated"));

    } catch (err) {
        console.error(err);
        return res.status(500).json(comRes.SERVER_ERROR(err.message));
    }

}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = async (req, res) => {
    const { uuid } = req.body;
    let clause = {
        where: {
            uuid: {
                [Op.eq]: uuid,
            }
        }
    }
    await crud.remove(res, Licenses, clause);
}
