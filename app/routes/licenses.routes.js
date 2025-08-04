const controller = require('../controllers');
const Licenses = controller.Licenses;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });



const middleware = require('../middlewares');
const verifyToken = middleware.eitherToken;

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    app.get('/licenses/get', [verifyToken], Licenses.get);
    app.get('/licenses/find', [verifyToken], Licenses.find);
    app.post('/licenses/create', [verifyToken], Licenses.create);
    app.post('/licenses/upload', [verifyToken, upload.single('file')], Licenses.uploadData);
    app.put('/licenses/update', [verifyToken], Licenses.update);
    app.delete('/licenses/delete', [verifyToken], Licenses.delete)
}