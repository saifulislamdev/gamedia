const express = require('express');
const router = express.Router();
const { getAccountInfo } = require('../models/user');
const { getPostsFromUser } = require('../models/post');
const dbPool = require('../models');

router.get('/:username', async (req, res) => {
    const { username } = req.params;
    const getAccountInfoRes = await getAccountInfo(username, dbPool);

    // no user
    if (!getAccountInfoRes)
        res.status(400).json({ msg: 'No user exists with matching username' });
    // server error
    else if (!getAccountInfoRes[0])
        res.status(500).json({ msg: getAccountInfoRes[1] });
    // successful
    else res.status(200).json(getAccountInfoRes);
});

router.get('/:username/posts', async (req, res) => {
    const { username } = req.params;
    const getPostsFromUserRes = await getPostsFromUser(username, dbPool);

    // username exists (posts or no posts available)
    if (getPostsFromUserRes[0] || getPostsFromUserRes.length === 0)
        res.status(200).json(getPostsFromUserRes);
    // server error
    else if (getPostsFromUserRes[1] === 'Internal server error')
        res.status(500).json({ msg: getPostsFromUserRes });
    // client error (no corresponding username)
    else res.status(400).json({ msg: getPostsFromUserRes[1] });
});

module.exports = router;
