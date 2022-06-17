const fs = require('fs');
var colors = require('colors');

const deletion = (req, res) => {
    const regId = req.params.name;
    if (fs.existsSync(__registryDir+"/"+regId)) {
  try {
    // stats = fs.statSync(path);
    read(__registryDir+"/"+regId, function(data) {
        fs.unlink(__uploadsDir+"/"+data, (err) => {
          if (err) {
            console.error(err)
            return
          }
        })
        fs.unlink(__registryDir+"/"+regId, (err) => {
          if (err) {
            console.error(err)
            return
          }
        })
    })
      console.log(`--\nRemoved: ${regId}\n--`)
      res.render('info.ejs', {title: `Success!`, desc: `File associated with ${regId} was successfully deleted!`});
    } catch (e) {
      res.render('info.ejs', {title: `Failure!`, desc: `Failed to delete ${regId}! Unknown error.`});
  }
} else {res.render('info.ejs', {title: `File Not Found!`, desc: `Token ${regId} does not exist in this server's registry!`});}
}

  /*
  Read file
  */
  function read(file, callback) {
    fs.readFile(file, 'utf8', function(err, data) {
      if (err) {
        console.log(err);
      }
      callback(data);
    });
  }

  module.exports = { deletion };