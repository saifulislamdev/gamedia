const async = require('async');

function follow(follower, following, pool) {
    /* 
    Purpose: Allows a user to follow another user
    Input:
        follower: username of user who wants to follow (is making the follow) [string]
        following: username of user that the follower wants to follow (the user being followed) [string]
        pool: pool to DB (result of pg.Pool() method in index.js)
    Output: [Promise]
        If follow is made, returns { success: true, msg: `${follower} is now following ${following}` }.
        If follower does not exist or has been deactivated, returns { success: false, msg: 'Follower does not exist or may be deactivated' }.
        If following does not exist or has been deactivated, returns { success: false, msg: 'Following does not exist or may be deactivated' }.
        If follower is following the user already, returns { success: false, msg: 'Already following' }.
        If there is another error, returns { success: false, msg: 'Internal server error' }.
    */
    // TODO: Saiful, add a check so that they aren't following themselves (either in table, code, or both)
    return new Promise((resolve, reject) => {
        async.waterfall([
            function verifyFollower(callback) {
                const sql =
                    'SELECT Username FROM Login WHERE Username = $1 AND Status = true';
                pool.query(sql, [follower], (err, res) => {
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
                            msg: 'Follower does not exist or may be deactivated',
                        });
                    }
                    callback(null, true);
                });
            },
            function verifyFollowing(verification, callback) {
                // TODO: function repetition from previous
                if (!verification) return;
                const sql =
                    'SELECT Username FROM Login WHERE Username = $1 AND Status = true';
                pool.query(sql, [following], (err, res) => {
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
                            msg: 'Following does not exist or may be deactivated',
                        });
                    }
                    callback(null, true);
                });
            },
            function verifyNoFollow(verification, callback) {
                if (!verification) return;
                const sql =
                    'SELECT Status FROM Follow WHERE Follower = $1 AND Following = $2';
                pool.query(sql, [follower, following], (err, res) => {
                    if (err) {
                        callback(null, false, '');
                        return resolve({
                            success: false,
                            msg: 'Internal server error',
                        });
                    }
                    if (res.rowCount !== 0 && res.rows[0].status !== false) {
                        callback(null, false, '');
                        return resolve({
                            success: false,
                            msg: 'Already following',
                        });
                    }
                    if (res.rowCount === 0) {
                        callback(null, true, false);
                        return;
                    }
                    callback(null, true, true);
                });
            },
            function execute(verification, existingRow) {
                if (!verification) return;
                let sql;
                if (existingRow) {
                    sql =
                        'UPDATE Follow SET Status = true WHERE Follower = $1 AND Following = $2'; // TODO: error check this for the date update
                } else {
                    sql =
                        'INSERT INTO Follow(Follower, Following) VALUES($1, $2)';
                }
                pool.query(sql, [follower, following], (err, res) => {
                    return err
                        ? resolve({
                              success: false,
                              msg: 'Internal server error',
                          })
                        : resolve({
                              success: true,
                              msg: `${follower} is now following ${following}`,
                          });
                });
            },
        ]);
    });
}

function getMyFollowers(username, pool) {
    /* 
    Purpose: Shows all the users that is following a user in the order they started following the user (from newest to oldest)
    Input:
        username: username of the user being followed  [string]
        pool: pool to DB (result of pg.Pool() method in index.js)
    Output: [Promise]
        If there is no error, returns each username as objects in an array (i.e. ) // TODO: Saiful, change this
        If no one is following the user, returns { success: true, followers: [], msg: `No one is following ${username}` }.
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
                    'SELECT Follower \
                                FROM Follow \
                                JOIN Login ON Login.Username = Follow.Follower \
                                WHERE Following = $1 AND Login.Status = true AND Follow.Status = true\
                                ORDER BY Date DESC';
                pool.query(sql, [username], (err, res) => {
                    if (err)
                        return resolve({
                            success: false,
                            msg: 'Internal server error',
                        });
                    if (res.rowCount === 0)
                        return resolve({
                            success: true,
                            followers: [],
                            msg: `No one is following ${username}`,
                        });
                    return resolve({ success: true, followers: res.rows });
                });
            },
        ]);
    });
}

function getMyFollowing(username, pool) {
    /* 
    Purpose: Shows all the users that a user is following in the order they started following them (from newest to oldest)
    Input:
        username: username of the user who is following other users [string]
        pool: pool to DB (result of pg.Pool() method in index.js)
    Output: [Promise]
        If there is no error, returns each username as objects in an array (i.e. ) // TODO: Saiful, change this
        If the user is not following anyone returns { success: true, following: [], msg: `${username} is not following anyone` }.
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
                    'SELECT Following \
                                FROM Follow \
                                JOIN Login ON Login.Username = Follow.Following \
                                WHERE Follower = $1 AND Login.Status = true AND Follow.Status = true \
                                ORDER BY Date DESC';
                pool.query(sql, [username], (err, res) => {
                    if (err)
                        return resolve({
                            success: false,
                            msg: 'Internal server error',
                        });
                    if (res.rowCount === 0)
                        return resolve({
                            success: true,
                            following: [],
                            msg: `${username} is not following anyone`,
                        });
                    return resolve({ success: true, following: res.rows });
                });
            },
        ]);
    });
}

function getFollowingStatus(follower, following, pool) {
    /* 
    Purpose: Indicates if a user is following another user
    Input:
        follower: username of user who may be following [string]
        following: username of user that may be being followed [string]
        pool: pool to DB (result of pg.Pool() method in index.js)
    Output: [Promise]
        If the follower is following the following, returns { success: true, isFollowing: true }.
        If follower is not following the user, returns { success: true, isFollowing: false }.
        If there is another error, returns { success: false, msg: 'Internal server error' }.
    */
    return new Promise((resolve, reject) => {
        const sql =
            'SELECT Status FROM Follow WHERE Follower = $1 AND Following = $2';
        pool.query(sql, [follower, following], (err, res) => {
            if (err)
                return resolve({
                    success: false,
                    msg: 'Internal server error',
                });
            if (res.rowCount === 0 || res.rows[0].status === false)
                return resolve({
                    success: true,
                    isFollowing: false,
                });
            return resolve({
                success: true,
                isFollowing: true,
            });
        });
    });
}

function unfollow(follower, following, pool) {
    /* 
    Purpose: Allows a user to unfollow another user
    Input:
        follower: username of user who wants to unfollow (is making the unfollow) [string]
        following: username of user that the follower wants to unfollow (the user being unfollowed) [string]
        pool: pool to DB (result of pg.Pool() method in index.js)
    Output: [Promise]
        If unfollow is made, returns { success: true, msg: `${follower} is not following ${following} anymore` }.
        If follower does not exist or has been deactivated, returns { success: false, msg: `${follower} does not exist or may be deactivated` }.
        If following does not exist or has been deactivated, returns { success: false, msg: `${following} does not exist or may be deactivated` }.
        If follower is not following the user already, returns { success: false, msg: 'Already not following' }.
        If there is another error, returns { success: false, msg: 'Internal server error' }.
    */
    return new Promise((resolve, reject) => {
        async.waterfall([
            function verifyFollower(callback) {
                // TODO: repetition
                const sql =
                    'SELECT Username FROM Login WHERE Username = $1 AND Status = true';
                pool.query(sql, [follower], (err, res) => {
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
                            msg: `${follower} does not exist or may be deactivated`,
                        });
                    }
                    callback(null, true);
                });
            },
            function verifyFollowing(verification, callback) {
                // TODO: repetition from previous and other function
                if (!verification) return;
                const sql =
                    'SELECT Username FROM Login WHERE Username = $1 AND Status = true';
                pool.query(sql, [following], (err, res) => {
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
                            msg: `${following} does not exist or may be deactivated`,
                        });
                    }
                    callback(null, true);
                });
            },
            function verifyFollow(verification, callback) {
                // TODO: repetition from other function
                if (!verification) return;
                const sql =
                    'SELECT Status FROM Follow WHERE Follower = $1 AND Following = $2';
                pool.query(sql, [follower, following], (err, res) => {
                    if (err) {
                        callback(null, false);
                        return resolve({
                            success: false,
                            msg: 'Internal server error',
                        });
                    }
                    if (res.rowCount === 0 || res.rows[0].status === false) {
                        callback(null, false);
                        return resolve({
                            success: false,
                            msg: 'Already not following',
                        });
                    }
                    callback(null, true);
                });
            },
            function execute(verification) {
                if (!verification) return;
                let sql =
                    'UPDATE Follow SET Status = false WHERE Follower = $1 AND Following = $2'; // TODO: error check this for the date update
                pool.query(sql, [follower, following], (err, res) => {
                    return err
                        ? resolve({
                              success: false,
                              msg: 'Internal server error',
                          })
                        : resolve({
                              success: true,
                              msg: `${follower} is not following ${following} anymore`,
                          });
                });
            },
        ]);
    });
}

/* Testing */

// follow('saifulislam', 'ctp', pool).then(result => console.log(result));
// follow('saifulislam', 'ctp', pool).then(result => console.log(result));
// follow('saifulislam', 'ct', pool).then(result => console.log(result));
// follow('saifulislam', 'ronnycoste', pool).then(result => console.log(result));
// follow('saifulisla', 'ctp', pool).then(result => console.log(result));
// follow('ronnycoste', 'ctp', pool).then(result => console.log(result));
// follow('saifulislam', 'ctp', pool).then(result => console.log(result)); // unfollowed

// getMyFollowers('saifulislam', pool).then(result => console.log(result));
// getMyFollowers('saifulisla', pool).then(result => console.log(result));
// getMyFollowers('ronnycoste', pool).then(result => console.log(result));
// getMyFollowers('gamedia', pool).then(result => console.log(result));
// getMyFollowers('ctp', pool).then(result => console.log(result));

// getMyFollowing('saifulislam', pool).then(result => console.log(result));
// getMyFollowing('saifulisla', pool).then(result => console.log(result));
// getMyFollowing('ronnycoste', pool).then(result => console.log(result));
// getMyFollowing('ctp', pool).then(result => console.log(result));
// getMyFollowing('gamedia', pool).then(result => console.log(result));
// getMyFollowing('saifulislam', pool).then(result => console.log(result)); // not following

// getFollowingStatus('saifulislam', 'ctp', pool).then(result => console.log(result));
// getFollowingStatus('saifulisla', 'ctp', pool).then(result => console.log(result));
// getFollowingStatus('saifulisla', 'ct', pool).then(result => console.log(result));
// getFollowingStatus('saifulislam', 'ronnycoste', pool).then(result => console.log(result));
// getFollowingStatus('gamedia', 'saifulislam', pool).then(result => console.log(result));
// getFollowingStatus('ronnycoste', 'ctp', pool).then(result => console.log(result));

// unfollow('saifulislam', 'ctp', pool).then(result => console.log(result));
// unfollow('saifulislam', 'ctp', pool).then(result => console.log(result));
// unfollow('gamedia', 'ctp', pool).then(result => console.log(result));
// unfollow('saifulislam', 'ct', pool).then(result => console.log(result));
// unfollow('saifulislam', 'ronnycoste', pool).then(result => console.log(result));
// unfollow('saifulisla', 'ctp', pool).then(result => console.log(result));
// unfollow('ronnycoste', 'ctp', pool).then(result => console.log(result));

module.exports = {
    follow,
    getMyFollowers,
    getMyFollowing,
    getFollowingStatus,
    unfollow,
};