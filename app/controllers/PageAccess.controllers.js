const { v4: uuidv4 } = require('uuid');

const models = require('../models');
const services = require('../services');
const response = require('../response');


const comRes = response.response;
const crud = services.crud;
const validation = services.validation;
const payload = services.payload;


const IframeClient = models.IframeClient;
const Op = models.Sequelize.Op;

// <iframe src="lisa.com?uuid=something-uuid-for-client">
//     axios.post("localhost:8080/auth/iframeLogin?${req.}")
// </iframe>

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.get = async (req, res) => {
    let clause = {
        order: [['createdAt', 'DESC']],
    }
    await crud.read(res, IframeClient, clause);
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.find = async (req, res) => {
    const { uuid } = req.body;
    if (!uuid) {
        return res.status(400).json(comRes.BAD_REQUEST("req body must be present"));
    }

    let clause = {
        where: {
            uuid: {
                [Op.eq]: uuid,
            }
        }
    };
    await crud.find(res, IframeClient, clause);
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.create = async (req, res) => {
    const uuid = uuidv4();
    if (!validation.iframeClient(req)) {
        res.status(400)
            .json(comRes.BAD_REQUEST("payload is not fullfilled!"));
    }
    const data = payload.iframeClient(req.body, uuid);
    await crud.create(res, IframeClient, data);
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.update = async (req, res) => {
    const { uuid } = req.body;
    const data = payload.iframeClient(req.body, uuid);
    let clause = {
        where: {
            uuid: {
                [Op.eq]: uuid,
            }
        }
    };
    await crud.update(res, IframeClient, data, clause);
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
    };
    await crud.remove(res, IframeClient, clause);
}