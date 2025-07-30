const BASE_URL = "https://digio.pgn.co.id"
const axios = require('axios');

/**
 * 
 * @param {*} req 
 * @returns 
 */
exports.digioLogin = async (username, password, directory) => {
    try {
        const response = await axios.post(`${BASE_URL}/AuthService/account/${directory}`, {
            username: username,
            password: password,
        });

        console.log(response.data);
        if (response.data.Status === 1) {
            return {
                status: true,
                data: response.data,
            }
        }
        return {
            status: false,
            data: null,
        }
    } catch (e) {
        console.log(e.message);
        throw e;
    }
}