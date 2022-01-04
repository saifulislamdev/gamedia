const express = require('express');
const router = express.Router();
const dbPool = require('../models');
const { getAccountInfo } = require('../models/user');

router.get('/:username', async (req, res) => {
    const { username } = req.params;
    const getAccountInfoRes = await getAccountInfo(username, dbPool);

    if (!getAccountInfoRes)
        return res.status(204).json({ msg: 'No information about user' });

    if (!getAccountInfoRes[0])
        return res.status(500).json({ msg: 'Error occurred in the server' });

    res.status(200).json(getAccountInfoRes);
});

module.exports = router;
