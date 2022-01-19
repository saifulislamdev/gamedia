const express = require('express');
const router = express.Router();
const {
    createPost,
    getPublicPosts,
    setPostToPrivate,
    setPostToPublic,
    viewPost,
} = require('../models/post');
const dbPool = require('../models');

// TODO: testing for all of /api/controllers

router.get('/', async (req, res) => {
    const getPublicPostsRes = await getPublicPosts(dbPool);
    const { success, posts, msg } = getPublicPostsRes;

    // no posts or posts exist
    if (success) res.status(200).json({ posts: posts });
    else
        res.status(500).json({
            msg: msg,
        });
});

router.post('/', async (req, res) => {
    const { username, serverLink, caption, private } = req.body;

    // username, serverLink, and privacy setting need to be passed in through body
    if (
        typeof username === 'undefined' ||
        typeof serverLink === 'undefined' ||
        typeof private === 'undefined'
    )
        return res.status(400).json({
            msg: 'Username, server link, or privacy setting not indicated',
        });

    // handles different cases where `private` is passed in as a string or boolean
    const isPrivate =
        typeof private === 'boolean'
            ? private
            : private.toLowerCase() === 'true';

    const createPostRes = await createPost(
        username,
        serverLink,
        caption || '',
        isPrivate,
        dbPool
    );
    const { success, msg } = createPostRes;

    // successful
    if (success) res.status(201).json({ msg: msg });
    // server error
    else if (msg === 'Internal server error')
        res.status(500).json({ msg: msg });
    // client errors
    else res.status(400).json({ msg: msg });
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { username } = req.body; // user that is requesting to view the post (~sensitive)

    // username needs to be passed in through body
    if (typeof username === 'undefined')
        return res.status(400).json({
            msg: 'Username of user requesting to view the post not indicated',
        });

    const viewPostRes = await viewPost(Number(id), username, dbPool);
    const { success, post, msg } = viewPostRes;

    // successful
    if (success) res.status(200).json({ post: post });
    // not authorized
    else if (msg === 'User not allowed to view post')
        res.status(401).json({ msg: msg });
    // server error
    else if (msg === 'Internal server error')
        res.status(500).json({ msg: msg });
    // client error
    else res.status(400).json({ msg: msg });
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username, private } = req.body;

    // username and privacy setting need to be passed in through body
    if (typeof username === 'undefined' || typeof private === 'undefined')
        return res.status(400).json({
            msg: 'Username or privacy setting not indicated',
        });

    // handles different cases where `private` is passed in as a string or boolean
    const isPrivate =
        typeof private === 'boolean'
            ? private
            : private.toLowerCase() === 'true';

    // change to private post
    if (isPrivate) {
        const setPostToPrivateRes = await setPostToPrivate(
            Number(id),
            username,
            dbPool
        );
        const { success, msg } = setPostToPrivateRes;

        // successful
        if (success) res.status(200).json({ msg: msg });
        // not authorized
        else if (msg === "User not allowed to modify another user's post")
            res.status(401).json({ msg: msg });
        // server error
        else if (msg === 'Internal server error')
            res.status(500).json({ msg: msg });
        // client errors
        else res.status(400).json({ msg: msg });
    }

    // change to public post
    else {
        const setPostToPublicRes = await setPostToPublic(
            Number(id),
            username,
            dbPool
        );
        const { success, msg } = setPostToPublicRes;

        // successful
        if (success) res.status(200).json({ msg: msg });
        // not authorized
        else if (msg === "User not allowed to modify another user's post")
            res.status(401).json({ msg: msg });
        // server error
        else if (msg === 'Internal server error')
            res.status(500).json({ msg: msg });
        // client error
        else res.status(400).json({ msg: msg });
    }
});

module.exports = router;
