const express = require('express');
const router = express.Router();
const { createLogin, verifyLogin } = require('../models/auth');
const dbPool = require('../models');

router.get('/', async (req, res) => {
    const { username, password } = req.body;

    if (typeof username === 'undefined' || typeof password === 'undefined')
        return res
            .status(400)
            .json({ msg: 'Username or password not indicated' });

    const verifyLoginRes = await verifyLogin(username, password, dbPool);

    if (verifyLoginRes[0])
        return res.status(200).json({ msg: verifyLoginRes[1] }); // successful

    res.status(400).json({ msg: verifyLoginRes[1] }); // not successful
});

router.post('/', async (req, res) => {
    const { username, password, email, firstName, lastName } = req.body;

    if (
        typeof username === 'undefined' ||
        typeof password === 'undefined' ||
        typeof email === 'undefined' ||
        typeof firstName === 'undefined' ||
        typeof lastName === 'undefined'
    )
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
        return res.status(201).json({ msg: createLoginRes[1] }); // successful

    res.status(400).json({ msg: createLoginRes[1] }); // not successful
});

module.exports = router;
