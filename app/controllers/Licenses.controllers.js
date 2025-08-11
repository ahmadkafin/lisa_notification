const { v4: uuidv4 } = require('uuid');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');


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
    // if (!req.body || Object.keys(req.body).length === 0) {
    //     return res.status(400).json(comRes.BAD_REQUEST("req body must be present"));
    // }
    let clause = {
        where: {
            name: {
                [Op.like]: `%${req.query.name}%`,
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


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.uploadData = async (req, res) => {
    try {
        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const data = xlsx.utils.sheet_to_json(sheet);

        const mappedData = data.map(row => ({
            uuid: uuidv4(),
            name: row.name,
            start_date: typeof row.start_date === 'number'
                ? excelDateToJSDate(row.start_date)
                : dmyToIso(row.start_date),
            end_date: typeof row.end_date === 'number'
                ? excelDateToJSDate(row.end_date)
                : dmyToIso(row.end_date),
            volume: row.volume,
            satuan: row.satuan,
            harga_satuan: row.harga_satuan,
            jumlah: row.jumlah,
            username: row.username,
            password: row.password,
            lokasi_lisensi: row.lokasi_lisensi,
            description: row.description,
            last_user_input: req.body.last_user_input,
            createdAt: new Date(),
            updatedAd: new Date(),
        }));
        let licens_history_arr = [];
        for (let i = 0; i < mappedData.length; i++) {
            licens_history_arr.push(
                {
                    uuid: uuidv4(),
                    licenses_uuid: mappedData[i].uuid,
                    harga_satuan: mappedData[i].harga_satuan,
                    tanggal: mappedData[i].start_date,
                    description: mappedData[i].description,
                    last_user_input: mappedData[i].last_user_input,
                }
            );
        }
        await Licenses.bulkCreate(mappedData);
        await HistoryLicenses.bulkCreate(licens_history_arr);
        fs.unlinkSync(filePath);
        return res.status(201).json(comRes.CREATED({
            message: "Data berhasil import",
            total: mappedData.length,
        }));
    } catch (e) {
        const filePath = req.file.path;
        fs.unlinkSync(filePath);
        return res.status(500).json(comRes.SERVER_ERROR(e.message));
    }
}

function excelDateToJSDate(serial) {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400; // seconds
    const date_info = new Date(utc_value * 1000);
    return date_info.toISOString().split('T')[0]; // YYYY-MM-DD
}

function dmyToIso(dmy) {
    if (!dmy || typeof dmy !== "string") return dmy;
    const [d, m, y] = dmy.split('/');
    if (!d || !m || !y) return dmy; // return as is kalau tidak valid
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}