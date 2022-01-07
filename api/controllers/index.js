const express = require('express');
const router = express.Router();

// Load each controller
const appConfig = require('./appConfig.js');
const auth = require('./auth');
const posts = require('./posts');
const users = require('./users');

// Mount each controller under a specific route. These
// will be prefixes to all routes defined inside the controller
router.use('/', appConfig);
router.use('/auth', auth);
router.use('/posts', posts);
router.use('/users', users);

module.exports = router;
