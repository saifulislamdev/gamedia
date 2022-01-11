// This file is for setting up the database tables

const pool = require('./');

// Table creation statements
// TODO: Add more constraints to columns
const login = 'CREATE TABLE IF NOT EXISTS Login (\
                Username VARCHAR(255) PRIMARY KEY, \
                Password VARCHAR(255) NOT NULL, \
                Email VARCHAR(255) UNIQUE NOT NULL, \
                FirstName VARCHAR(255), \
                LastName VARCHAR(255), \
                Status BOOLEAN DEFAULT TRUE NOT NULL, \
                CHECK (length(Username) > 0), \
                CHECK (length(Password) > 0));'; // TODO: does UNIQUE work?
const post = 'CREATE TABLE IF NOT EXISTS Post (\
                Id SERIAL PRIMARY KEY, \
                Username VARCHAR(255) NOT NULL, \
                ServerLink VARCHAR(255) NOT NULL UNIQUE, \
                Caption VARCHAR(255) NOT NULL, \
                UploadDate TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL, \
                Private BOOLEAN NOT NULL, \
                Deleted BOOLEAN DEFAULT FALSE NOT NULL, \
                FOREIGN KEY (Username) REFERENCES Login(Username));'; // TODO: should Username be NOT NULL?
const follow = 'CREATE TABLE IF NOT EXISTS Follow (\
                    Follower VARCHAR(255) NOT NULL, \
                    Following VARCHAR(255) NOT NULL, \
                    Status BOOLEAN DEFAULT TRUE NOT NULL, \
                    Date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL, \
                    PRIMARY KEY (Follower, Following), \
                    FOREIGN KEY (Follower) REFERENCES Login(Username), \
                    FOREIGN KEY (Following) REFERENCES Login(Username));'; // TODO: should Follower and Following be NOT NULL?

// creates tables that are used in app
function createTables() {
    pool.query(login + post + follow, (err, res) => {
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
