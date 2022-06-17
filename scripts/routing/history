const fs = require('fs');
var colors = require('colors');

/*
History route
*/
const history = async (req, res) => {
    let jsonStr = JSON.stringify(req.cookies);
    let json = JSON.parse(jsonStr);
    
    let message = "Device upload history:"
    let files = [];
    let tokens = [];
    for (token in req.cookies) {
        files.push(json[token]);
        tokens.push(token);
    }
    if (tokens.length == 0) {
        message = "You have no history on this device."
    }
    res.render('history.ejs', {message: message, files: files, tokens: tokens});
}

module.exports = { history };