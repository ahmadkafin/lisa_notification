const controller = require('../controllers');
const Licenses = controller.Licenses;


module.exports = (app) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    app.get('/licenses/get', Licenses.get);
    app.get('/licenses/find', Licenses.find);
    app.post('/licenses/create', Licenses.create);
    app.put('/licenses/update', Licenses.update);
    app.delete('/licenses/delete', Licenses.delete)
}