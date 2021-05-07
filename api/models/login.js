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
                const sql = 'INSERT INTO Login VALUES($1, $2, $3, $4, $5, true)';
                pool.query(sql, [username, password, email, firstName, lastName], (err, res) => {
                    return err ? resolve([false, err]) : resolve([true]);
                });
            }
        ]);
    });
}

function getAccountInfo(username, pool) {
    /* 
    Purpose: Show user their account info when they visit their personal page
    Input:
        username: username of user [string]
        pool: pool to DB (result of pg.Pool() method in index.js)
    Output: [Promise]
        If no such user exists with the username, returns [] (an empty array).
        If there is no error, returns the email, first name, and last name of the user as an object in an array (i.e. [{'nysaifulislam@gmail.com', 'Saiful', 'Islam'}]).
        If there is an error, returns false with the message in an array (i.e. [false, 'Error message here']).
    */
    return new Promise((resolve, reject) => {
        const sql = 'SELECT Email, FirstName, LastName FROM Login WHERE Username = $1';
        pool.query(sql, [username], (err, res) => {
            if (err) return resolve([false, err]);
            if (res.rowCount === 0) return resolve([]);
            return resolve([res.rows[0]]);
        });
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
        If there is an error, returns false with the message in an array (i.e. [false, 'Error message here']).
        If no such user exists, returns [false].
        If the user exists, returns [true].
    */
    return new Promise((resolve, reject) => {
        const sql = 'SELECT Username, Password FROM Login WHERE Username = $1 AND Password = $2';
        pool.query(sql, [username, password], (err, res) => {
            if (err) return resolve([false, err]);
            if (res.rowCount === 0) return resolve([false]);
            return resolve([true]);
        });
    });
}

function updateUsername() { } // TODO: not needed for now but nice to have

function updatePassword() { } // TODO: not needed for now but nice to have

function updateEmail() { } // TODO: not needed for now but nice to have

function updateName() { } // TODO: not needed for now but nice to have

function deactivateLogin() { } // TODO: not needed for now but nice to have


/* Testing */

// createLogin('test', 'ronnyisacoolguy', 'test@gmail.com', 'Saiful', 'Islam', pool)
//     .then(result => {
//         console.log(result);
//     });

// getAccountInfo('saifulislam', pool).then(result => console.log(result));
// getAccountInfo('ronnycoste', pool).then(result => console.log(result));
// getAccountInfo('lol', pool).then(result => console.log(result));

// verifyLogin('saifulislam', 'ronnyisacoolguy', pool).then(result => console.log(result));
// verifyLogin('saifulislam', 'ronnyisacool', pool).then(result => console.log(result));
// verifyLogin('saiful', 'ronnyisacoolguy', pool).then(result => console.log(result));
// verifyLogin('saiful', 'ronnyisa', pool).then(result => console.log(result));


app.listen(3003, () => console.log('Listening on 3003'));