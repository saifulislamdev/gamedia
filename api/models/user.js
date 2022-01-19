function getAccountInfo(username, pool) {
    /* 
    Purpose: Show user their account info when they visit their personal page
    Input:
        username: username of user [string]
        pool: pool to DB (result of pg.Pool() method in index.js)
    Output: [Promise]
        If there is no error, returns a key-value pair in an object where the key is "accountInfo" and the value is information of the account as an object (email, first name, and last name of the user)
        If no such user exists with the username, returns { success: false, msg: 'No such user exists' }
        If there is an error, returns { success: false, msg: 'Internal server error' }
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
            return resolve({ success: true, accountInfo: res.rows[0] });
        });
    });
}

module.exports = { getAccountInfo };
