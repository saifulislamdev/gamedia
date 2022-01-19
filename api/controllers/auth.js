const express = require('express');
const router = express.Router();

const { createLogin, verifyLogin } = require('../models/auth');
const dbPool = require('../models');

router.get('/', async (req, res) => {
    const { username, password } = req.body;

    if (typeof username === 'undefined' || typeof password === 'undefined') // TODO: there may be a better way of writing this
        return res.status(400).json({
            msg: 'Username or password not indicated',
        });

    const verifyLoginRes = await verifyLogin(username, password, dbPool);
    const { success, msg } = verifyLoginRes;

    if (success) return res.status(200).json({ msg: msg }); // successful

    res.status(400).json({ msg: msg }); // not successful
});

router.post('/', async (req, res) => {
    const { username, password, email, firstName, lastName } = req.body;

    if (
        typeof username === 'undefined' ||
        typeof password === 'undefined' ||
        typeof email === 'undefined' ||
        typeof firstName === 'undefined' ||
        typeof lastName === 'undefined'
    ) // TODO: there may be a better way of writing this
        return res.status(400).json({ msg: 'Fields not indicated' });

    const createLoginRes = await createLogin(
        username,
        password,
        email,
        firstName,
        lastName,
        dbPool
    );
    const { success, msg } = createLoginRes;

    if (success) return res.status(201).json({ msg: msg }); // successful

    res.status(400).json({ msg: msg }); // not successful
});

module.exports = router;
