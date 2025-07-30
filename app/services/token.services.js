require('dotenv').config();

const jwt = require('jsonwebtoken');

exports.signTokenIframe = async (data) => {
    console.log(`sign by ${process.env.SECRET_KEY_IFRAME}`);
    const token = jwt.sign(
        {
            uuid: data.uuid,
            url: data.site_name,
        },
        process.env.SECRET_KEY_IFRAME,
        {
            expiresIn: '1h',
            audience: data.site_name,
            issuer: 'https://backend.lisa.com/'
        }
    )
    return token;
}

exports.signTokenLogin = async (data) => {
    const token = jwt.sign(
        {
            name: data.displayName,
            group: data.group,
            username: data.userId,
        },
        process.env.SECRET_KEY,
        {
            audience: data.userid,
            expiresIn: '1h'
        }
    );
    return token;
}