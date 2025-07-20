const controller = require('../controllers');
const SeedFake = controller.SeedFake;

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    app.post('/seedFake/generate', SeedFake.seedFakeData);
}