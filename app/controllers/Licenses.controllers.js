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
    let clause = {
        order: [['end_date', 'DESC']],
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
        res.status(400)
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
    const { uuid } = req.body
    let clause = {
        where: {
            uuid: {
                [Op.eq]: uuid,
            }
        }
    }
    let data = payload.licenses(req, uuid);
    await crud.update(res, Licenses, data, clause);
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