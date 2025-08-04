const common = require('../response');

const comRes = common.response;


/**
 * 
 * @param {*} res 
 * @param {*} Model 
 * @param {*} clause 
 */
exports.read = async (res, Model, clause) => {
    await Model.findAll(clause)
        .then((data) => {
            if (data.length === 0) {
                res.status(404).json(comRes.NOT_FOUND("NOT FOUND"));
                res.end();
            } else {
                res.status(200)
                    .json(comRes.SUCCESS(data));
            }
            res.end();
        }).catch(err => {
            res.status(500)
                .json(comRes.SERVER_ERROR(err.message))
        });
}

/**
 * 
 * @param {*} res 
 * @param {*} Model 
 * @param {*} clause 
 */
exports.find = async (res, Model, clause) => {
    await Model.findOne(clause)
        .then((data) => {
            if (!data) {
                res.status(404)
                    .json(comRes.NOT_FOUND("NOT FOUND"));
                res.end();
            } else {
                res.status(200)
                    .json(comRes.SUCCESS(data));
            }
        }).catch((err) => {
            res.status(500)
                .json(comRes.SERVER_ERROR("SERVER ERROR"));
            res.end;
        })
}

/**
 * 
 * @param {*} res 
 * @param {*} Model 
 * @param {*} payload 
 */
exports.create = async (res, Model, payload) => {
    await Model.create(payload)
        .then((data) => {
            res.status(201)
                .json(comRes.CREATED(data))
            res.end();
        })
        .catch((err) => {
            res.status(500)
                .json(comRes.SERVER_ERROR(err.message));
            res.end();
        });
}

/**
 * 
 * @param {*} res 
 * @param {*} Model 
 * @param {*} payload 
 * @param {*} clause 
 */
exports.update = async (res, Model, payload, clause) => {
    const found = await Model.findOne(clause);
    if (!found) {
        res.status(404).json(comRes.NOT_FOUND("NOT FOUND"));
        res.end();
    } else {
        await Model.update(payload, clause)
            .then((data) => {
                res.status(200)
                    .json(comRes.SUCCESS("updated"));
                res.end();
            }).catch((err) => {
                res.status(500)
                    .json(comRes.SERVER_ERROR(err.message));
            });
    }
}


/**
 * 
 * @param {*} res 
 * @param {*} Model 
 * @param {*} clause 
 */
exports.remove = async (res, Model, clause) => {
    const found = await Model.findOne(clause);
    if (!found) {
        res.status(404)
            .json(comRes.NOT_FOUND("NOT FOUND"));
        res.end();
    }
    await Model.destroy(clause)
        .then(() => {
            res.status(204);
            res.end();
        }).catch((err) => {
            res.status(500)
                .json(comRes.SERVER_ERROR(err.message));
            res.end();
        })
}