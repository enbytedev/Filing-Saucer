// Dependencies
const cors = require("cors");
const express = require("express");
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(`./FilingSaucer.db`, (err) => { if (err) { console.log('FilingSaucer.db failed to attach!', err) }});

// START 
// DATABASE TEST CODE

//db.run(`INSERT INTO users ('user_id', 'first_name', 'email', 'password_hash', 'api_token') VALUES
//('123456', 'john', 'john@example.com', '0', '0'),
//('345678', 'jane', 'jane@example.com', '1', '1');`);
  db.all(`SELECT email FROM users WHERE user_id LIKE '345678';`, function (err, result, fields) {
    if (err) throw err;
    console.log(result[0]);
  });

// END
// DATABASE TEST CODE

// Setup
const app = express();
const {origin, port} = require('./config.json');
global.__basedir = __dirname;
var corsOptions = {
  origin: `${origin}`
};
app.use(cors(corsOptions));
const initRoutes = require("./func/routing");
app.use(express.urlencoded({ extended: true }));
// Create static route and initialize other routing.
app.use(express.static('static'));
initRoutes(app);
// Open server.
app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});