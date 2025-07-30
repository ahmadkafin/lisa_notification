const controller = require('../controllers');
const Home = controller.Home;


const middleware = require('../middlewares');
const verifyToken = middleware.eitherToken;

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    app.get('/home/get', [verifyToken], Home.getStatus);
}