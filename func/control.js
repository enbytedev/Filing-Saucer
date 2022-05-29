//require('dotenv').config()
const uploadFile = require("./upload");
const fs = require('fs');

const url = `${process.env.url}`
const port = `${process.env.port}`

var colors = require('colors');

// Set URL
var urlFull = url
if (process.env.forcePortRemovalInApp == true) {
    urlFull = url
} else if (port != "80" && port != "443") {
    urlFull = `${url}:${port}/`
}
console.log("URL is set to ".blue + urlFull + "\nThe port is EXCLUDED for ports 80 & 443.".blue)

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
       res.render('info.ejs', {title: `Failure!`, desc: `Attached file was too large!`});
    }
    // Misc. failure
        res.render('info.ejs', {title: `Failure!`, desc: `Reason unknown!`});
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
res.render('upload.ejs', {shareLink: `${urlFull}share/${disc}-${safeName}`, deletionLink: `${urlFull}delete/${deletion}`});
};

/*

Webclient route

*/
const web = async (req, res) => {
    res.render('web.ejs');
}

/*

Share route

*/
const share = async (req, res) => {
  var path = __basedir+'/uploads/'+req.params.name;
try {
  stats = fs.statSync(path);
  res.render('share.ejs', {file: `${req.params.name}`, viewLink: `${urlFull}view/${req.params.name}`, downloadLink: `${urlFull}download/${req.params.name}`});
} catch{
  res.render('info.ejs', {title: `Failure!`, desc: `File ${req.params.name} does not exist in this server's content datastore!`});
  }
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
        res.render('info.ejs', {title: `Failure!`, desc: `File ${fileName} does not exist in this server's content datastore!`});
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
        res.render('info.ejs', {title: `Failure!`, desc: `File ${fileName} does not exist in this server's content datastore!`});
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
    res.render('info.ejs', {title: `Success!`, desc: `File associated with ${regId} was successfully deleted!`});
    } catch (e) {
    res.render('info.ejs', {title: `Failure!`, desc: `Token ${regId} does not exist in this server's registry!`});
}


}

module.exports = {
  upload,
  web,
  share,
  view,
  download,
  deletion,
};