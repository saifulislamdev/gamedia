const async = require('async');
const express = require('express');
const app = express();
const pool = require('./index.js');

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
       If there is no error, returns [true].
       If username is already taken by a user, returns [false, 'Username already taken'].
       If email is already taken by a user, returns [false, 'Email already taken'].
       If there is an error, returns false with the message in an array (i.e. [false, 'Error message here']).
    */
    return new Promise((resolve, reject) => {
        async.waterfall([
            function verify(callback) {
                const sql = 'SELECT Username, Email FROM Login WHERE Username = $1 OR Email = $2';
                pool.query(sql, [username, email], (err, res) => {
                    if (err) {
                        callback(null, false)
                        return resolve([false, err]);
                    }
                    if (res.rowCount !== 0) {
                        const result = res.rows[0];
                        callback(null, false);
                        if (username === result.username) return resolve([false, 'Username already taken']);
                        else return resolve([false, 'Email already taken']);
                    }
                    callback(null, true);
                });
            },
            function execute(verification) {
                if (!verification) return;
                const sql = 'INSERT INTO Login VALUES($1, $2, $3, $4, $5)';
                pool.query(sql, [username, password, email, firstName, lastName], (err, res) => {
                    return err ? resolve([false, err]) : resolve([true]);
                });
            }
        ]);
    });
}

// createLogin('test', 'ronnyisacoolguy', 'test@gmail.com', 'Saiful', 'Islam', pool)
//     .then(result => {
//         console.log(result);
//     });

app.listen(3003, () => console.log('Listening on 3003'));