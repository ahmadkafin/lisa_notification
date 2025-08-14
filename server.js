const express = require('express');
const cors = require('cors');
const db = require('./app/models');

// define port
const port = parseInt(process.env.PORT || process.argv[3] || 8282);

// initialization express app
const app = express();
app.use(express.json({ limit: '50Mb' }));
app.use(cors({}));
app.use(cors({
    origin: ['http://10.129.10.138', 'http://10.129.10.137', 'https://digio.pgn.co.id']
}))
app.use(express.urlencoded({ limit: '50Mb', extended: true }));

db.sequelize.sync({});

// endpoint for check if url is not working
app.get('/', (req, res) => {
    res.json({ msg: "active" });
});

require('./app/routes')(app);

// migration to db
// DO NOT USE {force: true}!!! otherwise your existing data will be deleted.
db.sequelize.sync();

// app start
app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});