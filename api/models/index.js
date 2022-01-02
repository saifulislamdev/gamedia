'use strict';

const pg = require('pg');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const pool = new pg.Pool({
    user: config['username'],
    host: config['host'],
    database: config['database'],
    password: config['password'],
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) console.log(err);
    else console.log(res.rows);
});

module.exports = pool;
