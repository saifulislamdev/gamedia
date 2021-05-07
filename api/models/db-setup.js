const express = require('express');
const app = express();
const pool = require('./index.js');

// table creation statements
const user = 'CREATE TABLE IF NOT EXISTS Login (\
                Username VARCHAR(255) PRIMARY KEY, \
                Password VARCHAR(255), \
                Email VARCHAR(255) UNIQUE, \
                FirstName VARCHAR(255), \
                LastName VARCHAR(255));';
const post = 'CREATE TABLE IF NOT EXISTS Post (\
                Id INT PRIMARY KEY, \
                Username VARCHAR(255), \
                ServerLink VARCHAR(255), \
                UploadDate TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, \
                PublicPrivacy BOOLEAN, \
                FOREIGN KEY (Username) REFERENCES Login(Username));';
const follow = 'CREATE TABLE IF NOT EXISTS Follow (\
                    Follower VARCHAR(255), \
                    Following VARCHAR(255), \
                    Status BOOLEAN, \
                    Date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, \
                    PRIMARY KEY (Follower, Following), \
                    FOREIGN KEY (Follower) REFERENCES Login(Username), \
                    FOREIGN KEY (Following) REFERENCES Login(Username));';

// creates tables that are used in app
function createTables() {
    pool.query(user + post + follow, (err, res) => {
        if (err) console.log(err);
        else console.log('All tables created');
    });
}

// create tables for app (uncomment when using, otherwise, remains commented)
createTables();

// deletes tables that are used in app
function deleteTables() {
    pool.query('DROP TABLE IF EXISTS Follow; \
                DROP TABLE IF EXISTS Post; \
                DROP TABLE IF EXISTS Login;', (err, res) => {
        if (err) console.log(err);
        else console.log('All tables deleted');
    });
}

// delete tables for app (uncomment when using, otherwise, remains commented)
// deleteTables();

app.listen(3002, () => console.log('Listening on 3002'));