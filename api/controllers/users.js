const express = require('express');
const router = express.Router();
const { getAccountInfo } = require('../models/user');
const { getPostsFromUser } = require('../models/post');
const dbPool = require('../models');

router.get('/:username', async (req, res) => {
    const { username } = req.params;
    const getAccountInfoRes = await getAccountInfo(username, dbPool);

    // no user
    if (getAccountInfoRes.msg === 'No such user exists')
        res.status(400).json({
            msg: getAccountInfoRes.msg,
        });
    // server error
    else if (getAccountInfoRes.msg === 'Internal server error')
        res.status(500).json({
            msg: getAccountInfoRes.msg,
        });
    // successful
    else res.status(200).json({ accountInfo: getAccountInfoRes.accountInfo });
});

router.get('/:username/posts', async (req, res) => {
    const { username } = req.params;
    const getPostsFromUserRes = await getPostsFromUser(username, dbPool);

    // username exists (posts or no posts available)
    if (getPostsFromUserRes.success)
        res.status(200).json({ posts: getPostsFromUserRes.posts });
    // server error
    else if (getPostsFromUserRes.msg === 'Internal server error')
        res.status(500).json({
            msg: getPostsFromUserRes.msg,
        });
    // client error (no corresponding username)
    else
        res.status(400).json({
            msg: getPostsFromUserRes.msg,
        });
});

module.exports = router;
