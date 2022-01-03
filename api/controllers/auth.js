const express = require('express');
const router = express.Router();
const dbPool = require('../models');
const { createLogin, verifyLogin } = require('../models/auth');

router.get('/', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(400).json({ msg: 'Fields not indicated' });

    const verifyLoginRes = await verifyLogin(username, password, dbPool);

    if (verifyLoginRes[0])
        return res.status(201).json({ msg: verifyLoginRes[1] });

    res.status(400).json({ msg: verifyLoginRes[1] });
});

router.post('/', async (req, res) => {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName)
        return res.status(400).json({ msg: 'Fields not indicated' });

    const createLoginRes = await createLogin(
        username,
        password,
        email,
        firstName,
        lastName,
        dbPool
    );

    if (createLoginRes[0])
        return res.status(201).json({ msg: createLoginRes[1] });

    res.status(400).json({ msg: createLoginRes[1] });
});

module.exports = router;
