const { v4: uuidv4 } = require('uuid');
const models = require('../models')
const services = require('../services');
const response = require('../response');

const crud = services.crud;
const validation = services.validation;
const payload = services.payload;
const Email = models.Email;
const Op = models.Sequelize.Op;
const comRes = response.response;


/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.get = async (req, res) => {
    await crud.read(res, Email, {});
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getByType = async (req, res) => {
    let clause = {
        where: {
            email_type: {
                [Op.eq]: req.body.email_type
            }
        }
    }
    await crud.read(res, Email, clause);
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.create = async (req, res) => {
    if (!validation.emailRecepient(req)) {
        return res.status(400)
            .json(comRes.BAD_REQUEST("payload is not fullfilled!"));
    }
    const uuid = uuidv4();
    const emailReceipt = payload.emailRecepient(req.body, uuid);
    await crud.create(res, Email, emailReceipt);
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.update = async (req, res) => {
    const { uuid } = req.body;
    if (!validation.emailRecepient(req)) {
        return res.status(400)
            .json(comRes.BAD_REQUEST("payload is not fullfilled!"));
    }

    if (!uuid) {
        return res.status(400)
            .json(comRes.BAD_REQUEST("payload is not fullfilled!"));
    }

    const emailReceipt = payload.emailRecepient(req.body, req.body.uuid);
    let clause = {
        where: {
            uuid: {
                [Op.eq]: req.body.uuid,
            }
        }
    }
    await crud.update(res, Email, emailReceipt, clause);
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.remove = async (req, res) => {
    const { uuid } = req.body;
    if (!uuid) {
        return res.status(400)
            .json(comRes.BAD_REQUEST("payload is not fullfilled!"));
    }
    let clause = {
        where: {
            uuid: {
                [Op.eq]: uuid,
            }
        }
    }
    await crud.remove(res, Email, clause);
}