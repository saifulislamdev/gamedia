const async = require('async');
const express = require('express');
const app = express();
const pool = require('./index.js');

app.listen(3005, () => console.log('Listening on 3005'));