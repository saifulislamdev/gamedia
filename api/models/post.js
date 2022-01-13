const async = require('async');

function createPost(username, serverLink, caption, private, pool) {
    /* 
    Purpose: User creates a new post
    Input:
        username: username of user [string]
        serverLink: link to photo/video in the server [string]
        caption: caption of post [string]
        private: privacy of post (if truth value, post is private; if false value, post is public) [boolean]
        pool: pool to DB (result of pg.Pool() method in index.js)
    Output: [Promise]
        If there is no error, returns { success: true, msg: 'Post created' }.
        If username does not exist or has been deactivated, returns { success: false, msg: 'Username does not exist or may be deactivated' }.
        If serverLink is not of string type or is an empty string, returns { success: false, msg: 'Provide a server link' }.
        If caption is not of string type, returns { success: false, msg: 'Caption must be of string type'}.
        If there is another error, returns { success: false, msg: 'Internal server error' }.
    */
    return new Promise((resolve, reject) => {
        if (typeof serverLink !== 'string' || serverLink.length === 0)
            return resolve({ success: false, msg: 'Provide a server link' });
        if (typeof caption !== 'string')
            return resolve({
                success: false,
                msg: 'Caption must be of string type',
            });
        async.waterfall([
            function verifyUsername(callback) {
                const sql =
                    'SELECT Username FROM Login WHERE Username = $1 AND Status = true';
                pool.query(sql, [username], (err, res) => {
                    if (err) {
                        callback(null, false);
                        return resolve({
                            success: false,
                            msg: 'Internal server error',
                        });
                    }
                    if (res.rowCount === 0) {
                        callback(null, false);
                        return resolve({
                            success: false,
                            msg: 'Username does not exist or may be deactivated',
                        });
                    }
                    callback(null, true);
                });
            },
            function execute(verification) {
                if (!verification) return;
                const sql =
                    'INSERT INTO Post(Username, ServerLink, Caption, Private) VALUES($1, $2, $3, $4)';
                pool.query(
                    sql,
                    [username, serverLink, caption, private],
                    (err, res) => {
                        return err
                            ? resolve({
                                  success: false,
                                  msg: 'Internal server error',
                              })
                            : resolve({
                                  success: true,
                                  msg: 'Post created',
                              });
                    }
                );
            },
        ]);
    });
}

function getPostsFromUser(username, pool) {
    /* 
    Purpose: Gets all posts a user has made in order from newest to oldest (for when they visit their own page)
    Input:
        username: username of user [string]
        pool: pool to DB (result of pg.Pool() method in index.js)
    Output: [Promise]
        If user has posts, returns information of each post as objects in an array (i.e. ). // TODO: Saiful, change this
        If user has made no posts, returns { success: true, posts: [], msg: 'User has no posts' }.
        If username does not exist or has been deactivated, returns { success: false, msg: 'Username does not exist or may be deactivated' }.
        If there is another error, returns { success: false, msg: 'Internal server error' }.
    */
    return new Promise((resolve, reject) => {
        async.waterfall([
            function verifyUsername(callback) {
                // TODO: repetition
                const sql =
                    'SELECT Username FROM Login WHERE Username = $1 AND Status = true';
                pool.query(sql, [username], (err, res) => {
                    if (err) {
                        callback(null, false);
                        return resolve({
                            success: false,
                            msg: 'Internal server error',
                        });
                    }
                    if (res.rowCount === 0) {
                        callback(null, false);
                        return resolve({
                            success: false,
                            msg: 'Username does not exist or may be deactivated',
                        });
                    }
                    callback(null, true);
                });
            },
            function execute(verification) {
                if (!verification) return;
                const sql =
                    'SELECT Id, Username, ServerLink, Caption, UploadDate, Private \
                                FROM Post \
                                WHERE Username = $1 AND Deleted = false \
                                ORDER BY UploadDate DESC'; // TODO: might not want to return username as well
                pool.query(sql, [username], (err, res) => {
                    if (err)
                        return resolve({
                            success: false,
                            msg: 'Internal server error',
                        });
                    if (res.rowCount === 0)
                        return resolve({
                            success: true,
                            posts: [],
                            msg: 'User has no posts',
                        });
                    return resolve({ success: true, posts: res.rows });
                });
            },
        ]);
    });
}

// TODO: check all resolves for object and no array

function getPublicPosts(pool) {
    /* 
    Purpose: Gets all posts posted publically in order from newest to oldest (for public feed which is viewable by anyone)
    Input:
        pool: pool to DB (result of pg.Pool() method in index.js)
    Output: [Promise]
        If there are posts, returns information of each post as objects in an array (i.e. ). // TODO: Saiful, change this
        If there are no posts that are posted publically, returns { success: true, posts: [], msg: 'No public posts'}.
        If there is an error, returns { success: false, msg: 'Internal server error' }.
    */
    return new Promise((resolve, reject) => {
        const sql =
            'SELECT Id, Username, ServerLink, Caption, UploadDate, Private \
                        FROM Post \
                        WHERE Private = false AND Deleted = false \
                        ORDER BY UploadDate DESC'; // TODO: might not want to give Private
        pool.query(sql, (err, res) => {
            if (err)
                return resolve({
                    success: false,
                    msg: 'Internal server error',
                });
            if (res.rowCount === 0)
                return resolve({
                    success: true,
                    posts: [],
                    msg: 'No public posts',
                });
            return resolve({ success: true, posts: res.rows });
        });
    });
}

function getFeed(username, pool) {
    // TODO: not needed for now but nice to have
    /*
    Purpose: Get the feed a user sees which contains posts from their following (for their homepage)
    */
}

function viewPost(id, username, pool) {
    /* 
    Purpose: Gets post if the user has proper viewing privileges
    Input:
        id: id of the post the user wants to view [int]
        username: the user that wants to view the post [string]
        pool: pool to DB (result of pg.Pool() method in index.js)
    Output: [Promise]
        If there is no error, returns information of the post as an object in an array (i.e. ). // TODO: Saiful, change this
        If the user is not allowed to view the post due to privacy, returns { success: false, post: {}, msg: 'User not allowed to view post' }.
        If the id does not match a post or post is deleted, returns { success: false, post: {}, msg: 'Post does not exist' }.
        If username does not exist or has been deactivated, returns { success: false, post: {}, msg: 'Username does not exist or may be deactivated' }.
        If there is another error, returns { success: false, post: {}, msg: 'Internal server error' }.
    */
    return new Promise((resolve, reject) => {
        async.waterfall([
            function verifyPost(callback) {
                const sql =
                    'SELECT Id, Username, ServerLink, Caption, UploadDate, Private FROM Post WHERE Id = $1 AND Deleted = false';
                pool.query(sql, [id], (err, res) => {
                    if (err) {
                        callback(null, false, '');
                        return resolve({
                            success: false,
                            msg: 'Internal server error',
                        });
                    }
                    if (res.rowCount === 0) {
                        callback(null, false, '');
                        return resolve({
                            success: false,
                            msg: 'Post does not exist',
                        });
                    }
                    callback(null, true, res.rows[0]);
                });
            },
            function verifyUsername(verification, postInfo, callback) {
                if (!verification) return;
                const sql =
                    'SELECT Username FROM Login WHERE Username = $1 AND Status = true';
                pool.query(sql, [username], (err, res) => {
                    if (err) {
                        callback(null, false, '');
                        return resolve({
                            success: false,
                            msg: 'Internal server error',
                        });
                    }
                    if (res.rowCount === 0) {
                        callback(null, false, '');
                        return resolve({
                            success: false,
                            msg: 'Username does not exist or may be deactivated',
                        });
                    }
                    callback(null, true, postInfo);
                });
            },
            function verifyPrivilege(verification, postInfo, callback) {
                if (!verification) return;
                if (postInfo.username === username) {
                    callback(null, true, postInfo);
                    return;
                }
                if (postInfo.private === false) {
                    callback(null, true, postInfo);
                    return;
                }
                const sql =
                    'SELECT Status FROM Follow WHERE Follower = $1 AND Following = $2';
                pool.query(sql, [username, postInfo.username], (err, res) => {
                    if (err) {
                        callback(null, false, '');
                        return resolve({
                            success: false,
                            msg: 'Internal server error',
                        });
                    }
                    if (res.rowCount === 0 || res.rows[0].status === false) {
                        callback(null, false, '');
                        return resolve({
                            success: false,
                            msg: 'User not allowed to view post',
                        });
                    }
                    callback(null, true, postInfo);
                });
            },
            function execute(verification, postInfo) {
                if (!verification) return;
                return resolve({ success: true, post: postInfo });
            },
        ]);
    });
}

function setPostToPrivate(id, username, pool) {
    // TODO: two functions can be combined to one
    /* 
    Purpose: User sets a post they previously made to private
    Input:
        id: id of the post the user wants to private [int]
        username: the user that wants to private the post [string] (for verifying they are privating one of their posts, not someone else's)
        pool: pool to DB (result of pg.Pool() method in index.js)
    Output: [Promise]
        If there is no error, returns { success: true, msg: 'Post privacy set to private' }.
        If post is already private, returns { success: true, msg: 'Post already set to private' }.
        If username is not the owner of the post, returns { success: false, msg: "User not allowed to modify another user's post" }.
        If the id does not match a post or post is deleted, returns { success: false, msg: 'Post does not exist' }.
        If account associated with username is deactivated, returns { success: false, msg: "User's account is currently deactivated" }.
        If there is another error, returns { success: false, msg: 'Internal server error' }.
    */
    return new Promise((resolve, reject) => {
        async.waterfall([
            function verifyPost(callback) {
                const sql =
                    'SELECT Id, Username, ServerLink, Caption, UploadDate, Private FROM Post WHERE Id = $1 AND Deleted = false';
                pool.query(sql, [id], (err, res) => {
                    if (err) {
                        callback(null, false, '');
                        return resolve({
                            success: false,
                            msg: 'Internal server error',
                        });
                    }
                    if (res.rowCount === 0) {
                        callback(null, false, '');
                        return resolve({
                            success: false,
                            msg: 'Post does not exist',
                        });
                    }
                    callback(null, true, res.rows[0]);
                });
            },
            function verifyUserOfPost(verification, postInfo, callback) {
                // TODO: repetition here and in other functions
                if (!verification) return;
                if (postInfo.username !== username) {
                    callback(null, false, '');
                    return resolve({
                        success: false,
                        msg: "User not allowed to modify another user's post",
                    });
                }
                callback(null, true, postInfo);
            },
            function verifyActiveUser(verification, postInfo, callback) {
                if (!verification) return;
                let sql = 'SELECT Status FROM Login WHERE Username = $1';
                pool.query(sql, [username], (err, res) => {
                    if (err) {
                        callback(null, false, '');
                        return resolve({
                            success: false,
                            msg: 'Internal server error',
                        });
                    }
                    if (res.rows[0].status === false) {
                        callback(null, false, '');
                        return resolve({
                            success: false,
                            msg: "User's account is currently deactivated",
                        });
                    }
                    callback(null, true, postInfo);
                });
            },
            function verifyCurrPublic(verification, postInfo, callback) {
                // TODO: repetition here and in other functions
                if (!verification) return;
                if (postInfo.private === true) {
                    callback(null, false);
                    return resolve({
                        success: true,
                        msg: 'Post already set to private',
                    });
                }
                callback(null, true);
            },
            function execute(verification) {
                if (!verification) return;
                const sql = 'UPDATE Post SET Private = true WHERE Id = $1';
                pool.query(sql, [id], (err, res) => {
                    return err
                        ? resolve({
                              success: false,
                              msg: 'Internal server error',
                          })
                        : resolve({
                              success: true,
                              msg: 'Post privacy set to private',
                          });
                });
            },
        ]);
    });
}

function setPostToPublic(id, username, pool) {
    /* 
    Purpose: User sets a post they previously made to public
    Input:
        id: id of the post the user wants to make public [int]
        username: the user that wants to set the post to public [string] (for verifying they are privating one of their posts, not someone else's)
        pool: pool to DB (result of pg.Pool() method in index.js)
    Output: [Promise]
        If there is no error, returns { success: true, msg: 'Post privacy set to public' }.
        If post is already public, returns { success: true, msg: 'Post already set to public' }.
        If username is not the owner of the post, returns { success: false, msg: "User not allowed to modify another user's post" }.
        If the id does not match a post or post is deleted, returns { success: false, msg: 'Post does not exist' }.
        If account associated with username is deactivated, returns { success: false, msg: "User's account is currently deactivated" }.
        If there is another error, returns { success: false, msg: 'Internal server error' }.
    */
    return new Promise((resolve, reject) => {
        async.waterfall([
            function verifyPost(callback) {
                const sql =
                    'SELECT Id, Username, ServerLink, Caption, UploadDate, Private FROM Post WHERE Id = $1 AND Deleted = false';
                pool.query(sql, [id], (err, res) => {
                    if (err) {
                        callback(null, false, '');
                        return resolve({
                            success: false,
                            msg: 'Internal server error',
                        });
                    }
                    if (res.rowCount === 0) {
                        callback(null, false, '');
                        return resolve({
                            success: false,
                            msg: 'Post does not exist',
                        });
                    }
                    callback(null, true, res.rows[0]);
                });
            },
            function verifyUserOfPost(verification, postInfo, callback) {
                if (!verification) return;
                if (postInfo.username !== username) {
                    callback(null, false, '');
                    return resolve({
                        success: false,
                        msg: "User not allowed to modify another user's post",
                    });
                }
                callback(null, true, postInfo);
            },
            function verifyActiveUser(verification, postInfo, callback) {
                if (!verification) return;
                let sql = 'SELECT Status FROM Login WHERE Username = $1';
                pool.query(sql, [username], (err, res) => {
                    if (err) {
                        callback(null, false, '');
                        return resolve({
                            success: false,
                            msg: 'Internal server error',
                        });
                    }
                    if (res.rows[0].status === false) {
                        callback(null, false, '');
                        return resolve({
                            success: false,
                            msg: "User's account is currently deactivated",
                        });
                    }
                    callback(null, true, postInfo);
                });
            },
            function verifyCurrPrivate(verification, postInfo, callback) {
                if (!verification) return;
                if (postInfo.private === false) {
                    callback(null, false);
                    return resolve({
                        success: true,
                        msg: 'Post already set to public',
                    });
                }
                callback(null, true);
            },
            function execute(verification) {
                if (!verification) return;
                const sql = 'UPDATE Post SET Private = false WHERE Id = $1';
                pool.query(sql, [id], (err, res) => {
                    return err
                        ? resolve({
                              success: false,
                              msg: 'Internal server error',
                          })
                        : resolve({
                              success: true,
                              msg: 'Post privacy set to public',
                          });
                });
            },
        ]);
    });
}

function deletePost() {} // TODO: not needed for now but nice to have

/* Testing */

// createPost('saifulislam', 'https://lh3.googleusercontent.com/ogw/ADGmqu8MnV2bpvwlJsIBE-Mwd3qtc7uOjcw-QGohfGnw=s83-c-mo', 'My Google Profile Picture', false, pool).then(result => console.log(result));
// createPost('test', 'https://lh3.googleusercontent.com/ogw/ADGmqu8MnV2bpvwlJsIBE-Mwd3qtc7uOjcw-QGohfGnw=s83-c-mo', 'My Google Profile Picture', false, pool).then(result => console.log(result));
// createPost('ronnycoste', 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', 'Google', false, pool).then(result => console.log(result)); // deactivated
// createPost('saifulislam', '', 'My Google Profile Picture', false, pool).then(result => console.log(result));
// createPost('saifulislam', null, 'My Google Profile Picture', false, pool).then(result => console.log(result));
// createPost('saifulislam', 'https://lh3.googleusercontent.com/ogw/ADGmqu8MnV2bpvwlJsIBE-Mwd3qtc7uOjcw-QGohfGn/w=s83-c-mo', '', false, pool).then(result => console.log(result));
// createPost('saifulislam', 'https://lh3.googleusercontent.com/ogw/ADGmqu8MnV2bpvwlJsIBE-Mwd3qtc7uOjcw-QGohfGnw=s83-c-mo', null, false, pool).then(result => console.log(result));
// createPost('saifulislam', 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', 'My Google Profile Picture', true, pool).then(result => console.log(result));
// createPost('saifulislam', false, 'My Google Profile Picture', false, pool).then(result => console.log(result));
// createPost('gamedia', 'https://media.gq.com/photos/5ba143d4fc6c6260e811638b/16:9/w_2560%2Cc_limit/Toad-Alternatives-GQ-2018-091818.jpg', 'Toad is the way to go', false, pool).then(result => console.log(result));

// getPostsFromUser('saifulislam', pool).then(result => console.log(result));
// getPostsFromUser('test', pool).then(result => console.log(result));
// getPostsFromUser('ronnycoste', pool).then(result => console.log(result)); // deactivated
// getPostsFromUser('ctp', pool).then(result => console.log(result));
// getPostsFromUser('gamedia', pool).then(result => console.log(result));

// getPublicPosts(pool).then(result => console.log(result));
// getPublicPosts(pool).then(result => console.log(result)); // no public posts

// viewPost(9, 'gamedia', pool).then(result => console.log(result));
// viewPost(1000, 'gamedia', pool).then(result => console.log(result));
// viewPost(9, 'test', pool).then(result => console.log(result));
// viewPost(9, 'ronnycoste', pool).then(result => console.log(result));
// viewPost(6, 'saifulislam', pool).then(result => console.log(result));
// viewPost(6, 'gamedia', pool).then(result => console.log(result));
// viewPost(6, 'ctp', pool).then(result => console.log(result));

// setPostToPrivate(9, 'saifulislam', pool).then(result => console.log(result));
// setPostToPrivate(6, 'saifulislam', pool).then(result => console.log(result));
// setPostToPrivate(9, 'saifulisla', pool).then(result => console.log(result));
// setPostToPrivate(9, 'gamedia', pool).then(result => console.log(result));
// setPostToPrivate(1000, 'saifulislam', pool).then(result => console.log(result));
// setPostToPrivate(10, 'saifulislam', pool).then(result => console.log(result));
// setPostToPrivate(20, 'ronnycoste', pool).then(result => console.log(result));

// setPostToPublic(9, 'saifulislam', pool).then(result => console.log(result));
// setPostToPublic(10, 'saifulislam', pool).then(result => console.log(result));
// setPostToPublic(9, 'saifulisla', pool).then(result => console.log(result));
// setPostToPublic(9, 'gamedia', pool).then(result => console.log(result));
// setPostToPublic(1000, 'saifulislam', pool).then(result => console.log(result));
// setPostToPublic(11, 'gamedia', pool).then(result => console.log(result));
// setPostToPublic(20, 'ronnycoste', pool).then(result => console.log(result));

module.exports = {
    createPost,
    getPostsFromUser,
    getPublicPosts,
    viewPost,
    setPostToPrivate,
    setPostToPublic,
};
