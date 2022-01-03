const pg = require('pg');

const pool = new pg.Pool({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
});

module.exports = pool;
