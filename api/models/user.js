function getAccountInfo(username, pool) {
    /* 
    Purpose: Show user their account info when they visit their personal page
    Input:
        username: username of user [string]
        pool: pool to DB (result of pg.Pool() method in index.js)
    Output: [Promise]
        If there is no error, returns the email, first name, and last name of the user as an object (i.e. { success: true, accountInfo: {'nysaifulislam@gmail.com', 'Saiful', 'Islam'} } ). // TODO: update this
        If no such user exists with the username, returns { success: false, msg: 'No such user exists' }.
        If there is an error, returns { success: false, msg: 'Internal server error' }.
    */
    return new Promise((resolve, reject) => {
        const sql =
            'SELECT Email, FirstName, LastName FROM Login WHERE Username = $1';
        pool.query(sql, [username], (err, res) => {
            if (err)
                return resolve({
                    success: false,
                    msg: 'Internal server error',
                });
            if (res.rowCount === 0)
                return resolve({
                    success: false,
                    msg: 'No such user exists',
                });
            return resolve({ success: true, accountInfo: res.rows[0] }); // TODO: see what accountInfo looks like
        });
    });
}

// getAccountInfo('saifulislam', pool).then(result => console.log(result));
// getAccountInfo('ronnycoste', pool).then(result => console.log(result));
// getAccountInfo('lol', pool).then(result => console.log(result));

module.exports = { getAccountInfo };
