/**
 * STATUS CODE 400
 * @param {*} data 
 * @returns 
 */
exports.BAD_REQUEST = (data) => {
    return templateResponse(400, "BAD REQUEST", data);
}

/**
 * STATUS CODE 404
 * @param {*} data 
 * @returns 
 */
exports.NOT_FOUND = (data) => {
    return templateResponse(404, "NOT FOUND", data);
}


/**
 * STATUS CODE 401
 * @param {*} data 
 * @returns 
 */
exports.UNAUTHORIZED = (data) => {
    return templateResponse(401, "UNAUTHORIZED", data);
}

/**
 * STATUS CODE 403
 * @param {*} data 
 * @returns 
*/
exports.FORBIDDEN = (data) => {
    return templateResponse(403, "FORBIDDEN", data);
}

/**
 * STATUS CODE 500
 * @param {*} data 
 * @returns 
 */
exports.SERVER_ERROR = (data) => {
    return templateResponse(500, "SERVER ERROR", data);
}


/**
 * STATUS CODE 200
 * @param {*} data 
 * @returns 
 */
exports.SUCCESS = (data) => {
    return templateResponse(200, "OK", data);
}

/**
 * STATUS CODE 201
 * @param {*} data 
 * @returns 
 */
exports.CREATED = (data) => {
    return templateResponse(201, "CREATED", data);
}

function templateResponse(statusCode, response, data) {
    return {
        status: statusCode,
        response: response,
        data: data,
    }
}