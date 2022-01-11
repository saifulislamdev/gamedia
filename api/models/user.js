function getAccountInfo(username, pool) {
    /* 
    Purpose: Show user their account info when they visit their personal page
    Input:
        username: username of user [string]
        pool: pool to DB (result of pg.Pool() method in index.js)
    Output: [Promise]
        If there is no error, returns the email, first name, and last name of the user as an object in an array (i.e. [{'nysaifulislam@gmail.com', 'Saiful', 'Islam'}]).
        If no such user exists with the username, returns [] (an empty array).
        If there is an error, returns [false, 'Internal server error'].
    */
    return new Promise((resolve, reject) => {
        const sql =
            'SELECT Email, FirstName, LastName FROM Login WHERE Username = $1';
        pool.query(sql, [username], (err, res) => {
            if (err) return resolve([false, 'Internal server error']);
            if (res.rowCount === 0) return resolve([]);
            return resolve([res.rows[0]]);
        });
    });
}

// getAccountInfo('saifulislam', pool).then(result => console.log(result));
// getAccountInfo('ronnycoste', pool).then(result => console.log(result));
// getAccountInfo('lol', pool).then(result => console.log(result));

module.exports = { getAccountInfo };
