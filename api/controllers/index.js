const express = require('express');
const router = express.Router();

// Load each controller
const appConfig = require('./appConfig.js');
const auth = require('./auth');

// Mount each controller under a specific route. These
// will be prefixes to all routes defined inside the controller
router.use('/', appConfig);
router.use('/auth', auth);

module.exports = router;
