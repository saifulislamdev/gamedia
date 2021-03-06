const async = require('async');

function createLogin(username, password, email, firstName, lastName, pool) {
    /* 
    Purpose: Creates login for a new user
    Input:
        username: desired username of user [string]
        password: desired password of user [string] // TODO: would be a good idea to hash password and not allow empty strings
        email: email address of user for the account [string]  // TODO: would be a good idea to verify email structure
        firstName: first name of user [string]
        lastName: last name of user [string]
        pool: pool to DB (result of pg.Pool() method in index.js)
    Output: [Promise]
        If there is no error, returns { success: true, msg: 'Created successfully' }
        If username is already taken by a user, returns { success: false, msg: 'Username already taken' }
        If email is already taken by a user, returns { success: false, msg: 'Email already taken' }
        If there is another error, returns { success: false, msg: 'Internal server error' }
    */
    return new Promise((resolve, reject) => {
        async.waterfall([
            function verify(callback) {
                const sql =
                    'SELECT Username, Email FROM Login WHERE Username = $1 OR Email = $2';
                pool.query(sql, [username, email], (err, res) => {
                    if (err) {
                        callback(null, false);
                        return resolve({
                            success: false,
                            msg: 'Internal server error',
                        });
                    }
                    if (res.rowCount !== 0) {
                        const result = res.rows[0];
                        callback(null, false);
                        if (username === result.username)
                            return resolve({
                                success: false,
                                msg: 'Username already taken',
                            });
                        else
                            return resolve({
                                success: false,
                                msg: 'Email already taken',
                            });
                    }
                    callback(null, true);
                });
            },
            function execute(verification) {
                if (!verification) return;
                const sql = 'INSERT INTO Login VALUES($1, $2, $3, $4, $5)';
                pool.query(
                    sql,
                    [username, password, email, firstName, lastName],
                    (err, res) => {
                        return err
                            ? resolve({
                                  success: false,
                                  msg: 'Internal server error',
                              })
                            : resolve({
                                  success: true,
                                  msg: 'Created successfully',
                              });
                    }
                );
            },
        ]);
    });
}

function verifyLogin(username, password, pool) {
    /* 
    Purpose: Verifies that a login exists (for sign-in)
    Input:
        username: username of user [string]
        password: password of user [string]
        pool: pool to DB (result of pg.Pool() method in index.js)
    Output: [Promise]
        If the user exists, returns { success: true, msg: 'Valid login' }
        If no such user exists, returns { success: false, msg: 'Invalid credentials' }
        If there is another error, returns { success: false, msg: 'Internal server error' }
    */
    return new Promise((resolve, reject) => {
        const sql =
            'SELECT Username, Password FROM Login WHERE Username = $1 AND Password = $2';
        pool.query(sql, [username, password], (err, res) => {
            if (err)
                return resolve({
                    success: false,
                    msg: 'Internal server error',
                });
            if (res.rowCount === 0)
                return resolve({ success: false, msg: 'Invalid credentials' });
            return resolve({ success: true, msg: 'Valid login' });
        });
    });
}

function updateUsername() {} // TODO: not needed for now but nice to have

function updatePassword() {} // TODO: not needed for now but nice to have

function updateEmail() {} // TODO: not needed for now but nice to have

function updateName() {} // TODO: not needed for now but nice to have

function deactivateLogin() {} // TODO: not needed for now but nice to have

module.exports = { createLogin, verifyLogin };
