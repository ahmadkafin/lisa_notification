const controller = require('../controllers');
const Cron = controller.Cron;

const middleware = require('../middlewares');
const verifyToken = middleware.eitherToken;

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    app.get('/cron/running', [verifyToken], Cron.get);
    app.post('/cron/create', [verifyToken], Cron.create);
    app.post('/cron/switch', [verifyToken], Cron.cronSwitch);
    app.put('/cron/update', [verifyToken], Cron.update);
}