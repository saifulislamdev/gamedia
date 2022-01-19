const express = require('express');
const router = express.Router();

const {
    follow,
    getFollowingStatus,
    getMyFollowers,
    getMyFollowing,
    unfollow,
} = require('../models/connections');
const dbPool = require('../models');

router.get('/followers/:username', async (req, res) => {
    const { username } = req.params;

    const getMyFollowersRes = await getMyFollowers(username, dbPool);
    const { success, followers, msg } = getMyFollowersRes;

    if (success) return res.status(200).json({ followers: followers });

    if (msg === 'Internal server error')
        return res.status(500).json({ msg: msg });

    res.status(400).json({ msg: msg });
});

router.get('/following/:username', async (req, res) => {
    const { username } = req.params;

    const getMyFollowingRes = await getMyFollowing(username, dbPool);
    const { success, following, msg } = getMyFollowingRes;

    if (success) return res.status(200).json({ following: following });

    if (msg === 'Internal server error')
        return res.status(500).json({ msg: msg });

    res.status(400).json({ msg: msg });
});

router.get('/follower/:follower/following/:following', async (req, res) => {
    const { follower, following } = req.params;

    const getFollowingStatusRes = await getFollowingStatus(
        follower,
        following,
        dbPool
    );
    const { success, isFollowing, msg } = getFollowingStatusRes;

    if (success) return res.status(200).json({ isFollowing: isFollowing });

    res.status(500).json({ msg: msg });
});

router.post('/follower/:follower/following/:following', async (req, res) => {
    const { follower, following } = req.params;

    const followRes = await follow(follower, following, dbPool);
    const { success, msg } = followRes;

    if (success) return res.status(204).json();

    if (msg === 'Internal server error')
        return res.status(500).json({ msg: msg });

    res.status(400).json({ msg: msg });
});

router.delete('/follower/:follower/following/:following', async (req, res) => {
    const { follower, following } = req.params;

    const unfollowRes = await unfollow(follower, following, dbPool);
    const { success, msg } = unfollowRes;

    if (success) return res.status(204).json(); // TODO: check if 200/201 status codes make sense

    if (msg === 'Internal server error')
        return res.status(500).json({ msg: msg });

    res.status(400).json({ msg: msg });
});

module.exports = router;
