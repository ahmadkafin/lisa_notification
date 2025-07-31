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

    app.post('/cron/:name/start', [verifyToken], Cron.cronStart);
    app.post('/cron/:name/stop', [verifyToken], Cron.cronStop);
    app.get('/cron/running', [verifyToken], Cron.cronRunning);
}


// pm2 start SERVER_ERROR.js--name lisa_backend