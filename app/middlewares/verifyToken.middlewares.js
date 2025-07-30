require('dotenv').config();
const jwt = require('jsonwebtoken');
const response = require('../response');
const resCom = response.response;

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json(resCom.UNAUTHORIZED("You Shall Not Pass!"),);
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json(resCom.UNAUTHORIZED("Invalid Authorization header format. Use Bearer <token>"));
    }

    const token = parts[1];
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.username = decoded.username;
        return next();
    } catch (err) {
        // Kalau gagal, coba dengan SECRET_KEY_IFRAME (iframe)
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY_IFRAME);
            req.uuid = decoded.uuid;
            return next();
        } catch (err2) {
            return res.status(401)
                .json(resCom.UNAUTHORIZED("Invalid or expired token."));
        }
    }
}