module.exports = (app) => {
    require('./licenses.routes')(app);
    require('./seedFake.routes')(app);
    require('./cron.routes')(app);
}