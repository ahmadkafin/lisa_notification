const { v4: uuidv4 } = require('uuid');
const cron = require('node-cron');
const models = require('../models');
const services = require('../services');
const response = require('../response');
const fn = require('../function');

const crud = services.crud;
const Cron = models.Cron;
const Op = models.Sequelize.Op;
const resCom = response.response;

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.get = async (req, res) => {
    await crud.read(res, Cron, {});
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.create = async (req, res) => {
    const { name, time_schedule, is_running } = req.body;

    if (!name || !time_schedule || is_running === undefined) {
        return res.status(400).json(resCom.BAD_REQUEST("Payload is not fullfiled"));
    }

    let payloadData = {
        uuid: uuidv4(),
        name: req.body.name,
        time_schedule: req.body.time_schedule,
        is_running: req.body.is_running,
    };

    const jobFunction = functionMap[req.body.name];
    const clause = {
        where: {
            name: {
                [Op.eq]: req.body.name
            }
        }
    }
    const found = await Cron.findOne(clause);
    if (found) {
        res.status(409).json({
            message: "This Name is already exist"
        });
    } else {
        if (req.body.is_running == true && jobFunction) {
            // JIKA LAGSUNG START DAN FUNCTION TERSEDIA
            await Cron.create(payloadData).then((response) => {
                console.log(`[${new Date().toISOString()}] Cron job for ${req.body.name} is running...`);
                try {
                    let cronStart = cron.schedule(req.body.time_schedule, jobFunction, {
                        scheduled: true,
                    });

                    jobRefs[response.uuid] = cronStart;

                    console.log(`✅ Task '${req.body.name}' berhasil dijadwalkan`);
                    return res.status(200).json(resCom.SUCCESS({
                        cronName: req.body.name,
                        status: `✅ Running success and create cron on ${req.body.time_schedule}`,
                    }));
                } catch (e) {
                    return res.status(500).json(resCom.SERVER_ERROR({
                        cronName: req.body.name,
                        status: `❌ Running Failed with error ${e.message}`,
                    }));
                }
            }).catch((e) => {
                return res.status(500).json(resCom.SERVER_ERROR({
                    cronName: req.body.name,
                    status: `❌ Create Failed with error ${e.message}`,
                }));
            })
        } else if (req.body.is_running === true && !jobFunction) {
            // JIKA LANGSUNG START DAN FUNCTION TIDAK TERSEDIA
            return res.status(400).json(resCom.BAD_REQUEST(
                `Function '${req.body.name}' tidak ditemukan di mapping. Cron tidak dijalankan, silakan cek nama function.`
            ));
        } else {
            // JIKA HANYA BUAT DI DB
            await Cron.create(payloadData).then((response) => {
                return res.status(200).json(resCom.SUCCESS({
                    cronName: req.body.name,
                    status: `✅ Success create cron ${req.body.name} on ${req.body.time_schedule}, but cron with that name is not exist, you have to make the function by yourself.`,
                }));
            }).catch((e) => {
                return res.status(500).json(resCom.SERVER_ERROR({
                    cronName: req.body.name,
                    status: `❌ Create Failed with error with create data ${e.message}`,
                }));
            })
        }
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.cronSwitch = async (req, res) => {
    const { uuid } = req.body;
    if (!uuid) {
        return res.status(400).json(resCom.BAD_REQUEST("Payload is not fullfiled"));
    }

    let clause = {
        where: {
            uuid: {
                [Op.eq]: req.body.uuid,
            }
        }
    };
    const found = await Cron.findOne(clause);
    if (!found) {
        return res.status(404).json(resCom.NOT_FOUND("NOT FOUND"));
    }
    const jobFunction = functionMap[found.name];

    if (req.body.is_running === true && !jobFunction) {
        return res.status(400).json(resCom.BAD_REQUEST(
            `Function '${req.body.name}' tidak ditemukan di mapping. Cron tidak dijalankan, silakan cek nama function.`
        ));
    } else {
        await Cron.update(
            { is_running: req.body.is_running },
            clause,
        ).then((resp) => {
            if (req.body.is_running === true) {
                try {
                    let cronStart = cron.schedule(found.time_schedule, jobFunction, {
                        scheduled: true,
                    });
                    if (jobRefs[found.uuid]) {
                        jobRefs[found.uuid].stop();
                    }
                    jobRefs[found.uuid] = cronStart;
                    return res.status(200).json(resCom.SUCCESS({
                        cronName: found.name,
                        status: `✅ Cron '${found.name}' berhasil dijalankan ulang.`,
                    }));
                } catch (e) {
                    return res.status(500).json(resCom.SERVER_ERROR({
                        cronName: req.body.name,
                        status: `❌ Create Failed with error ${e.message}`,
                    }));
                }
            } else {
                if (jobRefs[found.uuid]) {
                    jobRefs[found.uuid].stop();
                    return res.status(200).json(resCom.SUCCESS({
                        cronName: found.name,
                        status: `⏹️ Cron '${found.name}' berhasil dihentikan.`,
                    }));
                } else {
                    return res.status(404).json(resCom.NOT_FOUND(
                        `Job reference for '${found.name}' not found in memory (mungkin belum pernah dijalankan di server ini).`
                    ));
                }
            }
        })
    }
}

const functionMap = {
    sendEmail: fn.sendEmail,
}

const jobRefs = {}