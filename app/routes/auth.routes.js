const controller = require('../controllers')
const Auth = controller.Auth;

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    app.post('/auth/login', Auth.login);
    app.post('/auth/iframeLogin', Auth.createTokenIframe);
}