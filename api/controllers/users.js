const express = require('express');
const router = express.Router();
const { getAccountInfo } = require('../models/user');
const { getPostsFromUser } = require('../models/post');
const dbPool = require('../models');

router.get('/:username', async (req, res) => {
    const { username } = req.params;
    const getAccountInfoRes = await getAccountInfo(username, dbPool);
    const { accountInfo, msg } = getAccountInfoRes;

    // no user
    if (msg === 'No such user exists')
        res.status(400).json({
            msg: msg,
        });
    // server error
    else if (msg === 'Internal server error')
        res.status(500).json({
            msg: msg,
        });
    // successful
    else res.status(200).json({ accountInfo: accountInfo });
});

router.get('/:username/posts', async (req, res) => {
    const { username } = req.params;
    const getPostsFromUserRes = await getPostsFromUser(username, dbPool);
    const { success, posts, msg } = getPostsFromUserRes;

    // username exists (posts or no posts available)
    if (success) res.status(200).json({ posts: posts });
    // server error
    else if (msg === 'Internal server error')
        res.status(500).json({
            msg: msg,
        });
    // client error (no corresponding username)
    else
        res.status(400).json({
            msg: msg,
        });
});

module.exports = router;
