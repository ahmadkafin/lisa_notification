const moment = require('moment');
const config = require('../../config')
const models = require('../models')

const Licenses = models.Licenses;
const Mails = models.Email;
const Op = models.Sequelize.Op;
const mail = config.nodemailer.mail;
const htmlBody = config.htmlBody;


module.exports = async () => {
    try {
        let data = await checkSoonExpire();
        if (Array.isArray(data) || data.length === 0) {
            console.log("✅ Tidak ada data lisensi yang mendekati expire (clean data)");
            return;
        }
        // let dataParse = data.map((i) => `<li>${i.name} berakhir pada tanggal ${i.end_date} sekitar ${i.days_left} hari lagi</li>`)
        const dataParse = data.map((i) => emailList(i));
        const mailOpt = {
            from: "kafinahmad@17gmail.com",
            to: getAllEmailRecepient("to"),
            cc: getAllEmailRecepient("cc"),
            bcc: getAllEmailRecepient("bcc"),
            subject: "(NO-REPLY) REMINDER EXPIRE APPLICATION",
            text: "(NO-REPLY) REMINDER EXPIRE APPLICATION",
            html: htmlBody.body(dataParse),
        }
        mail.sendMail(mailOpt);
    } catch (e) {
        console.error("❌ Gagal mengirim email reminder:", err);
    }
}

function emailList(data) {
    return `
    <li>
        <strong>Nama: ${data.name}</strong>:
        <ul style="margin:0; padding-left:20px; list-style-type: disc;">
            <li>Volume: ${data.volume} ${data.unit}</li>
            <li>Harga Satuan: Rp ${data.harga_satuan} (harga tanggal ${data.end_date})</li>
            <li>Total Harga: Rp ${data.harga_satuan * data.volume}</li>
            <li>Keterangan: ${data.description}</li>
            <li>Periode Mulai: ${data.start_date}</li>
            <li>Periode Berakhir: ${data.end_date}</li>
        </ul>
    </li>`
}


async function getAllEmailRecepient(emailType) {
    const clause = {
        raw: true,
        where: {
            email_type: {
                [Op.eq]: emailType,
            },
        }
    };
    let arrEmail = [];
    const data = await Mails.findAll(clause);
    for (let i = 0; i < data.length; i++) {
        arrEmail.push(data[i].email);
    };
    return arrEmail;
}

async function checkSoonExpire() {
    try {
        const today = moment();
        const license = await Licenses.findAll();
        const reminders = license.map(li => {
            const endDate = moment(li.end_date);
            const daysLeft = endDate.diff(today, 'days');
            if ([120, 90, 30].includes(daysLeft)) {
                return {
                    name: li.name,
                    end_date: li.end_date,
                    days_left: daysLeft,
                    message: `Lisensi ${li.name} akan berakhir dalam ${daysLeft} hari`,
                }
            }
            return null;
        }).filter(Boolean);
        return reminders;
    } catch (e) {
        console.error(e.message);
        return null;
    }
}
