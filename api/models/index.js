'use strict';

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
// const Sequelize = require('sequelize');
const pg = require('pg');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};


const pool = new pg.Pool({
  user: config['username'],
  host: config['host'],
  database: config['database'],
  password: config['password']
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) console.log(err);
  else console.log(res.rows);
  pool.end();
});

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// not sure if we need the bottom part
// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach(file => {
//     // const model = sequelize['import'](path.join(__dirname, file));
//     const model = sequelize.import(path.join(__dirname, file));
//     const modelName = model.name.charAt(0).toUpperCase() + model.name.slice(1);
//     db[modelName] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;

app.listen(3001, () => console.log('Listening on 3001'));

module.exports = pool;