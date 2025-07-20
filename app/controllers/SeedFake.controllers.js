require('dotenv').config();
const { v4: uuidv4 } = require('uuid')

const models = require('../models');
const service = require('../services');
const common = require('../response');
const config = require('../../config');

const comRes = common.response;
const crud = service.crud;
const faker = config.faker;

const Licenses = models.Licenses;
const HistoryLicenses = models.HistoryLicenses;


exports.seedFakeData = async (req, res) => {
    try {
        const isDev = process.env.ISDEV === "true";

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json(comRes.BAD_REQUEST("iteration must be present"));
        }

        if (req.body.iteration === "" || req.body.iteration === null || req.body.iteration === undefined || req.body.iteration === "undefined") {
            res.status(400).json(comRes.BAD_REQUEST("iteration must be present"));
        }


        if (req.body.iteration === 0) {
            res.status(400).json(comRes.BAD_REQUEST("iterations cannot be 0"));
        }

        if (isDev) {
            for (let i = 0; i < req.body.iteration; i++) {
                await Licenses.create(
                    faker.Licenses(),
                ).then(async (data) => {
                    await HistoryLicenses.create(
                        {
                            uuid: uuidv4(),
                            licenses_uuid: data.uuid,
                            harga_satuan: data.harga_satuan,
                            tanggal: data.start_date,
                            description: data.description,
                            last_user_input: data.last_user_input,
                        }
                    );
                })
            }
            res.status(201).json(comRes.CREATED("your datas has been crearted"));
        } else {
            res.status(200).json(comRes.SUCCESS("Your environtment is production please change to development"));
        }
    } catch (e) {
        res.status(500).json(comRes.SERVER_ERROR(e.message));

    }

}