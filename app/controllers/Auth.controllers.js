const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const services = require('../services');
const response = require('../response');
const models = require('../models');

const tokenService = services.token;
const digioService = services.digioservice;
const resCom = response.response;
const IframeClient = models.IframeClient;
const Op = models.Sequelize.Op;
const decooded = services.decodedToken;

exports.login = async (req, res) => {
    const { username, password, directory } = req.body;
    if (!username || !password || !directory) {
        return res.status(400).json(resCom.BAD_REQUEST("Payload is not complete"));
    }
    try {
        const digioResp = await digioService.digioLogin(username, password, directory);
        if (!digioResp.status) {
            return res.status(403).json(resCom.FORBIDDEN(digioResp));
        }
        const data = decooded(digioResp.data.AccessToken);
        const token = await tokenService.signTokenLogin(data);

        return res.status(200).json({
            name: data.displayName,
            group: data.group,
            username: data.userId,
            token: token,
            expires: 3600,
        });
    } catch (e) {
        return res.status(500).json(resCom.SERVER_ERROR(e.message));
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.createTokenIframe = async (req, res) => {
    const uuid = req.query.uuid;
    if (!uuid) {
        return res.status(400).json(resCom.BAD_REQUEST("Payload is not complete"));
    }
    try {
        const clientFound = await IframeClient.findOne({
            where: {
                uuid: {
                    [Op.eq]: uuid,
                },
                is_revoked: {
                    [Op.eq]: false,
                }
            }
        });
        if (!clientFound) {
            return res.status(401).json(resCom.UNAUTHORIZED());
        }
        const token = await tokenService.signTokenIframe(clientFound);

        // button di email mengarah ke digio
        if (clientFound.redirect != null) {
            if (clientFound.redirect.includes("https://digio.pgn.co.id") && clientFound.site_name.includes("https://digio.pgn.co.id")) {
                const username = process.env.USERNAME;
                const password = process.env.PASSWORD;
                const directory = process.env.DIRECTORY;

                const dRes = await digioService.digioLogin(username, password, directory);
                const cookieData = await getCookieData(dRes.data.AccessToken);

                return res.status(200).json({
                    status: 200,
                    token: token,
                    redirect: clientFound.redirect,
                    cookie_session: cookieData,
                });
            }
        } else {
            return res.status(200).json(resCom.SUCCESS(token));
        }

    } catch (e) {
        return res.status(500).json(resCom.SERVER_ERROR(e.message));
    }
}

async function getCookieData(token) {
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://digio.pgn.co.id/digio/digiohandlers/AuthToken.ashx?mobile=true',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
    let parsedCookies = "";
    return axios.request(config)
        .then((res) => {
            let cookie = res.headers['set-cookie'];
            console.log(`set cookie is ${cookie}`);
            if (cookie && Array.isArray(cookie)) {
                parsedCookies = cookie.map(cookieStr => {
                    const [nameValuePair] = cookieStr.split(';');
                    const [name, value] = nameValuePair.split('=');
                    return { name: name.trim(), value: value.trim() };
                });
                parsedCookies = parsedCookies[0].name + '=' + parsedCookies[0].value;
                return parsedCookies;
            }
        }).catch((err) => {
            console.log(err.message);
            return;
        });
}