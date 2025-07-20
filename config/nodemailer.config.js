require('dotenv').config();
const nodemailer = require('nodemailer');

exports.mail = nodemailer.createTransport({
    services: "Gmail",
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnathorized: true,
    }
});