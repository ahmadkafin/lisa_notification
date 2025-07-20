const controller = require('../controllers');
const Cron = controller.Cron;


module.exports = (app) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    app.post('/cron/:name/start', Cron.cronStart);
    app.post('/cron/:name/stop', Cron.cronStop);
}