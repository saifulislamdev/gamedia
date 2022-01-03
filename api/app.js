const express = require('express');
const morgan = require('morgan');
const path = require('path');
const dbPool = require('./models');
const app = express();

// this lets us parse 'application/json' content in http requests
app.use(express.json());

// add http request logging to help us debug and audit app use
const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(logFormat));

// this mounts controllers/index.js at the route `/api`
app.use('/api', require('./controllers'));

// for production use, we serve the static react build folder
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));

    // all unknown routes should be handed to our react app
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}

// start up the server
const PORT = process.env.PORT;
if (PORT) {
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
} else {
    console.log('===== ERROR ====\nCREATE A .env FILE!\n===== /ERROR ====');
}

// connect to DB
dbPool.query('SELECT NOW()', (err, res) => {
    if (err) console.log(err);
    else console.log('Database connected');
});
