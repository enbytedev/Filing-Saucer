const config = require("../config.json");
const uploadFile = require("./upload");
const fs = require('fs');

var url = `${config.url}/`
if (config.port != "80" && config.port != "443") {
    url = `${config.url}:${config.port}/`
}
console.log("URL is set to " + url + "\nThe port is EXCLUDED for ports 80 & 443.")

/*

Number generator

*/
function generate(n) {
  var add = 1,
  max = 12 - add;
  
  if (n > max) {
    return generate(max) + generate(n - max);
  }
  
  max = Math.pow(10, n + add);
  var min = max / 10; // Math.pow(10, n) basically 
  var number = Math.floor(Math.random() * (max - min + 1)) + min;
  
  return ("" + number).substring(add);
}

/*

Regex loop

a, String to operate on
b, First regex to use
c, Optional second regex to use
d, Optional third regex to use
*/
function regexSafety(a, b, c, d) {
  do {
    a = a.replace(b, "-")
  } while (a.match(b));
  if (c != null) {
    do {
      a = a.replace(c, "-")
    } while (a.match(c));
  }
  if (d != null) {
    do {
      a = a.replace(d, "-")
    } while (a.match(d));
  }
  return ("" + a);
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


/*

Upload route

*/
const upload = async (req, res) => {
  try {
    await uploadFile(req, res);
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please attach your desired file!" });
    }
// Catch errors
  } catch (err) {
    // File size limiting
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "Attempted to upload a file that is too large!",
      });
    }
    // Misc. failure
    res.status(500).send({
      message: `Failed to upload file: ${req.file.originalname}. ${err}`,
    });
  }
  // Generate random numbers
  let disc = `${generate(6)}`
  let deletion = `${generate(8)}`
  // Ensure the response is safe for web viewing and client app
  let safeName = regexSafety(req.file.originalname, /[|]/, /["]/, /[ ]/)
  var finalFile = `uploads/${disc}-${safeName}`
  // Move file out of temp
  fs.rename(`uploads/temp/${req.file.originalname}`, finalFile, function (err) {
    if (err) throw err
    console.log(`--\nUpload complete!\nUploaded to: ${finalFile}\n${req.file.originalname} --> ${disc}-${safeName}\n--`)
  })
  // Write registry entry
  fs.writeFile(`./uploads/registry/`+deletion, `${disc}-${safeName}`, (err) => {
    if (err) {
      throw err;
    }
  })
res.render('upload.ejs', {viewLink: `${url}view/${disc}-${safeName}`, deletionLink: `${url}delete/${deletion}`});
};

/*

Webclient route

*/
const web = async (req, res) => {
    res.render('web.ejs');
}
/*

View route
--

Views the requested file!
*/
const view = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/uploads/";
  res.sendFile(directoryPath + fileName, fileName, (err) => {
    if (err) {
        res.render('info.ejs', {issue: "File not found!"});
    }
  });
};

/*

Download route
--

Downloads the requested file!
*/
const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/uploads/";
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
        res.render('info.ejs', {issue: "File not found!"});
    }
  });
};

/*

Delete route
--

Delete the specified file!
*/
const deletion = (req, res) => {
  const regId = req.params.name;
  var path = __basedir+'/uploads/registry/'+regId;
try {
  stats = fs.statSync(path);
  var output = read(__basedir+'/uploads/registry/'+regId, function(data) {
      fs.unlink(__basedir+'/uploads/'+data, (err) => {
        if (err) {
          console.error(err)
          return
        }
      })
      fs.unlink(__basedir+'/uploads/registry/'+regId, (err) => {
        if (err) {
          console.error(err)
          return
        }
      })
  })
    console.log(`--\nRemoved: ${regId}\n--`)
    res.render('info.ejs', {issue: `File associated with ${regId} was successfully deleted!`});
    } catch (e) {
    res.render('info.ejs', {issue: `Token ${regId} does not exist in this server's registry!`});
}


}

module.exports = {
  upload,
  web,
  view,
  download,
  deletion,
};