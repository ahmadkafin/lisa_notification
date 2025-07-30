require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (token) => {
    const decoded = jwt.verify(token, process.env.DIGIO_SIG_KEY);
    return decoded;
}