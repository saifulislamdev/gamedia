const express = require('express');
const router = express.Router();
const dbPool = require('../models');
const { getAccountInfo } = require('../models/user');
const { getPostsFromUser } = require('../models/post');

router.get('/:username', async (req, res) => {
    const { username } = req.params;
    const getAccountInfoRes = await getAccountInfo(username, dbPool);

    if (!getAccountInfoRes)
        return res.status(204).json({ msg: 'No information about user' });

    if (!getAccountInfoRes[0])
        return res.status(500).json({ msg: 'Error occurred in the server' });

    res.status(200).json(getAccountInfoRes);
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
