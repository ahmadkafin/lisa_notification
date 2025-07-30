const controller = require('../controllers');
const IframeClient = controller.IframeClient;


const middleware = require('../middlewares');
const verifyToken = middleware.eitherToken;

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    app.get('/iframe-client/get', [verifyToken], IframeClient.get);
    app.get('/iframe-client/find', [verifyToken], IframeClient.find);
    app.post('/iframe-client/create', [verifyToken], IframeClient.create);
    app.put('/iframe-client/update', [verifyToken], IframeClient.update);
    app.delete('/iframe-client/delete', [verifyToken], IframeClient.delete)
}