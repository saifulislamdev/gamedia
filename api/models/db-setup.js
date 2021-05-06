const express = require('express');
const app = express();
const pool = require('./index.js');

// table creation statements
const user = 'CREATE TABLE IF NOT EXISTS Login(\
                Username VARCHAR(255) PRIMARY KEY, \
                Password VARCHAR(255), \
                FirstName VARCHAR(255), \
                LastName VARCHAR(255));';
const post = 'CREATE TABLE IF NOT EXISTS Post ( \
                Id INT PRIMARY KEY, \
                Username VARCHAR(255), \
                ServerLink VARCHAR(255), \
                UploadDate TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, \
                PublicPrivacy BOOLEAN, \
                FOREIGN KEY (Username) REFERENCES Login(Username));';
const follow = 'CREATE TABLE IF NOT EXISTS Follow ( \
                    Follower VARCHAR(255), \
                    Following VARCHAR(255), \
                    Status BOOLEAN, \
                    Date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, \
                    PRIMARY KEY (Follower, Following), \
                    FOREIGN KEY (Follower) REFERENCES Login(Username), \
                    FOREIGN KEY (Following) REFERENCES Login(Username));';

// create tables for app
function createTables() {
    pool.query(user + post + follow, (err, res) => {
        if (err) console.log(err);
        else console.log(res);
        pool.end();
    });
}

// create tables (uncomment when using, otherwise, remains commented)
// createTables();

function deleteTables() {

}

app.listen(3002, () => console.log('Listening on 3002'));