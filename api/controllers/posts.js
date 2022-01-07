const express = require('express');
const router = express.Router();
const dbPool = require('../models');
const {
    createPost,
    getPublicPosts,
    viewPost,
    setPostToPrivate,
    setPostToPublic,
} = require('../models/post');

router.get('/', async (req, res) => {
    const getPublicPostsRes = await getPublicPosts(dbPool);
    if (getPublicPostsRes.length === 0 || getPublicPostsRes[0])
        res.status(200).json(getPublicPostsRes);
    else res.status(500).json({ msg: 'Error occurred in the server' });
});

router.post('/', async (req, res) => {
    const { username, serverLink, caption, private } = req.body;

    // username, serverLink, and privacy setting are required
    if (!username || !serverLink || typeof private === 'undefined')
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
    if (createPostRes[0]) res.status(201).json({ msg: 'Post created' });
    // server error
    else if (createPostRes[1] === 'Internal server error')
        res.status(500).json({ msg: createPostRes[1] });
    // client errors
    else res.status(400).json({ msg: createPostRes[1] });
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { username } = req.body; // user that is requesting to view the post (~sensitive)

    if (typeof username === 'undefined')
        return res.status(400).json({
            msg: 'Username of user requesting to view the post not indicated',
        });

    const viewPostRes = await viewPost(Number(id), username, dbPool);

    // successful
    if (viewPostRes[0]) res.status(200).json(viewPostRes);

    // not authorized
    else if (viewPostRes[1] === 'User not allowed to view post')
        res.status(401).json({ msg: viewPostRes[1] });

    // server error
    else if (viewPostRes[1] === 'Internal server error')
        res.status(500).json({ msg: viewPostRes[1] });
    
    // client error
    else res.status(400).json(viewPostRes[1]); // errors
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username, private } = req.body;

    if (!username || typeof private === 'undefined')
        return res.status(400).json({
            msg: 'Privacy setting not indicated',
        });

    // handles different cases where `private` is passed in as a string or boolean
    const isPrivate =
        typeof private === 'boolean'
            ? private
            : private.toLowerCase() === 'true';

    if (isPrivate) {
        // change to private post
        const setPostToPrivateRes = await setPostToPrivate(
            Number(id),
            username,
            dbPool
        );
        if (setPostToPrivateRes[0])
            res.status(200).json({ msg: 'Privacy updated to private' });
        else if (
            setPostToPrivateRes[1] ===
            "User not allowed to modify another user's post"
        )
            res.status(401).json({ msg: setPostToPrivateRes[1] });
        else if (setPostToPrivateRes[1] === 'Internal server error')
            res.status(500).json({ msg: setPostToPrivateRes[1] });
        else res.status(400).json({ msg: setPostToPrivateRes[1] });
    } else {
        // change to public post
        const setPostToPublicRes = await setPostToPublic(
            Number(id),
            username,
            dbPool
        );
        if (setPostToPublicRes[0])
            res.status(200).json({ msg: 'Privacy updated to public' });
        else if (
            setPostToPublicRes[1] ===
            "User not allowed to modify another user's post"
        )
            res.status(401).json({ msg: setPostToPublicRes[1] });
        else if (setPostToPublicRes[1] === 'Internal server error')
            res.status(500).json({ msg: setPostToPublicRes[1] });
        else res.status(400).json({ msg: setPostToPublicRes[1] });
    }
});

module.exports = router;
