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

router.get('/', async (req, res) => {
    const getPublicPostsRes = await getPublicPosts(dbPool);

    // no posts or posts exist
    if (getPublicPostsRes.success)
        res.status(200).json({ posts: getPublicPostsRes.posts });
    else
        res.status(500).json({
            msg: getPublicPostsRes.msg,
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

    // successful
    if (createPostRes.success) res.status(201).json({ msg: createPostRes.msg });
    // server error
    else if (createPostRes.msg === 'Internal server error')
        res.status(500).json({ msg: createPostRes.msg });
    // client errors
    else res.status(400).json({ msg: createPostRes.msg });
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

    // successful
    if (viewPostRes.success) res.status(200).json({ post: viewPostRes.post });
    // not authorized
    else if (viewPostRes.msg === 'User not allowed to view post')
        res.status(401).json({ msg: viewPostRes.msg });
    // server error
    else if (viewPostRes.msg === 'Internal server error')
        res.status(500).json({ msg: viewPostRes.msg });
    // client error
    else res.status(400).json({ msg: viewPostRes.msg });
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

        // successful
        if (setPostToPrivateRes.success)
            res.status(200).json({ msg: setPostToPrivate.msg });
        // not authorized
        else if (
            setPostToPrivateRes.msg ===
            "User not allowed to modify another user's post"
        )
            res.status(401).json({ msg: setPostToPrivateRes.msg });
        // server error
        else if (setPostToPrivateRes.msg === 'Internal server error')
            res.status(500).json({ msg: setPostToPrivateRes.msg });
        // client errors
        else res.status(400).json({ msg: setPostToPrivateRes.msg });
    }

    // change to public post
    else {
        const setPostToPublicRes = await setPostToPublic(
            Number(id),
            username,
            dbPool
        );

        // successful
        if (setPostToPublicRes.success)
            res.status(200).json({ msg: setPostToPublicRes.msg });
        // not authorized
        else if (
            setPostToPublicRes.msg ===
            "User not allowed to modify another user's post"
        )
            res.status(401).json({ msg: setPostToPublicRes.msg });
        // server error
        else if (setPostToPublicRes.msg === 'Internal server error')
            res.status(500).json({ msg: setPostToPublicRes.msg });
        // client error
        else res.status(400).json({ msg: setPostToPublicRes.msg });
    }
});

module.exports = router;
