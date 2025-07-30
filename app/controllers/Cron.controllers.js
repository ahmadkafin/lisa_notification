const path = require('path');
const cron = require('node-cron');
const fs = require('fs');
const moment = require('moment');
const models = require('../models');
const config = require('../../config')
const mail = config.nodemailer.mail;
const htmlBody = config.htmlBody;
const Licenses = models.Licenses;

const readFileCron = async () => {
    const filePath = path.join(__dirname, '../../cron.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
};

const writeFileCron = async (data) => {
    const filePath = path.join(__dirname, '../../cron.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

const taskLiveMap = {}; // ini hanya di memory

const cronJob = (name) => async () => {
    console.log(`[${new Date().toISOString()}] Cron job for ${name} is running...`);
    // bisa diganti sesuai nama task
    if (name === 'sendemail') {
        // jalankan fungsi pengiriman email
        console.log('Checking data')
        await sendEmail();
    }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.cronStart = async (req, res) => {
    try {
        const { name } = req.params;
        const taskMap = await readFileCron();

        const taskIndex = taskMap.findIndex(e => e.name === name);
        if (taskIndex === -1) {
            return res.status(404).json({ message: `Task '${name}' tidak ditemukan!` });
        }

        const task = taskMap[taskIndex];

        if (task.isRunning || taskLiveMap[name]) {
            return res.status(400).json({ message: `Task '${name}' sudah berjalan` });
        }

        //  Schedule task & simpan ke memory, berjalan pada pukul 9 dan 15 setiap jam kerja
        const cronTask = cron.schedule('0 9,15 * * 1-5', cronJob(name), {
            scheduled: true,
        });
        console.log(`✅ Task '${name}' berhasil dijadwalkan`);

        taskLiveMap[name] = cronTask;

        // Update ke cron.json
        taskMap[taskIndex].isRunning = true;
        await writeFileCron(taskMap);

        res.status(200).json({
            message: `Task '${name}' telah dijalankan`,
            task: taskMap[taskIndex]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Gagal membaca atau memperbarui cron.json" });
    }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.cronStop = async (req, res) => {
    const { name } = req.params;
    const taskMap = await readFileCron();

    const taskIndex = taskMap.findIndex(e => e.name === name);
    if (taskIndex === -1) return res.status(404).json({ message: "Task tidak ditemukan" });

    if (taskLiveMap[name]) {
        taskLiveMap[name].stop();
        delete taskLiveMap[name];
    }

    taskMap[taskIndex].isRunning = false;
    await writeFileCron(taskMap);

    res.json({ message: `Task '${name}' berhasil dihentikan` });
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.cronRunning = async (req, res) => {
    try {
        const taskMap = await readFileCron();

        const runningTasks = Object.keys(taskLiveMap).map(name => ({
            name,
            isRunning: true
        }));

        const runningFromJson = taskMap.filter(task => task.isRunning);

        res.status(200).json({
            running_memory: runningTasks,
            running_persistent: runningFromJson
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Gagal membaca cron.json atau status task" });
    }
};


async function sendEmail() {
    try {
        let data = await checkSoonExpire();
        if (!Array.isArray(data) || data.length === 0) {
            console.log("✅ Tidak ada data lisensi yang mendekati expire (clean data)");
            return;
        }
        let dataparse = data.map((e) => `<li>${e.name} berakhir pada tanggal ${e.end_date} sekitar ${e.days_left} hari lagi</li>`);
        const mailOpt = {
            from: "kafinahmad17@gmail.com",
            to: "kafinahmad@gmail.com",
            subject: "(NO-REPLY) REMINDER EXPIRE APPLICATION",
            text: "(NO-REPLY) REMINDER EXPIRE APPLICATION",
            html: htmlBody.body(dataparse),
        }
        await mail.sendMail(mailOpt);
    } catch (e) {
        console.error("❌ Gagal mengirim email reminder:", err);
    }

}

async function checkSoonExpire() {
    try {
        const today = moment();
        const licenses = await Licenses.findAll();
        const reminders = licenses.map(license => {
            const endDate = moment(license.end_date);
            const daysLeft = endDate.diff(today, 'days');
            if ([120, 90, 30].includes(daysLeft)) {
                return {
                    name: license.name,
                    end_date: license.end_date,
                    days_left: daysLeft,
                    message: `Lisensi ${license.name} akan berakhir dalam ${daysLeft} hari`
                };
            }
            return null;
        }).filter(Boolean);
        return reminders;
    } catch (e) {
        console.error(e.message);
        return null;
    }
}
