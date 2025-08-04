const controller = require('../controllers');
const Email = controller.Email;

const middleware = require('../middlewares');
const verifyToken = middleware.eitherToken;

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    app.get('/email/get', [verifyToken], Email.get);
    app.get('/email/get/type', [verifyToken], Email.getByType);
    app.post('/email/create', [verifyToken], Email.create);
    app.put('/email/update', [verifyToken], Email.update);
    app.delete('/email/delete', [verifyToken], Email.remove);
}