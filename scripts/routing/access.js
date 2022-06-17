const fs = require('fs');
var colors = require('colors');

/*
Homepage route
*/
const home = async (req, res) => {
    res.render('web.ejs');
}

/*
Share route
*/
const share = async (req, res) => {
    var path = __uploadsDir+"/"+req.params.name;
  try {
    stats = fs.statSync(path);
    res.render('share.ejs', {file: `${req.params.name}`, viewLink: `${urlFull}view/${req.params.name}`, downloadLink: `${urlFull}download/${req.params.name}`});
  } catch {
    res.render('info.ejs', {title: `Failure!`, desc: `File ${req.params.name} does not exist in this server's content datastore!`});
    }
  }
  
  /*
  View route
  */
  const view = (req, res) => {
    res.sendFile(req.params.name, { root: __uploadsDir }, (err) => {
      if (err) {
          res.render('info.ejs', {title: `Failure!`, desc: `File ${req.params.name} does not exist in this server's content datastore!`});
      }
    });
  };
  
  /*
  Download route
  */
  const download = (req, res) => {
    res.download(__uploadsDir+"/"+req.params.name, req.params.name, (err) => {
      if (err) {
          res.render('info.ejs', {title: `Failure!`, desc: `File ${req.params.name} does not exist in this server's content datastore!`});
      }
    });
  };

module.exports = { home, share, view, download };