module.exports = (app) => {
    require('./licenses.routes')(app);
    require('./seedFake.routes')(app);
    require('./cron.routes')(app);
    require('./auth.routes')(app);
    require('./iframeclient.routes')(app);
    require('./home.routes')(app);
    require('./email.routes')(app);
}