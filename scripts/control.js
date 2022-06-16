//require('dotenv').config()
const uploadFile = require("./upload");
const fs = require('fs');

const url = `${process.env.url}`
const port = `${process.env.port}`
const forcePortRm = `${process.env.forcePortRemovalInApp}`
var colors = require('colors');

// Set URL
var urlFull = url
if (forcePortRm == "true") {
    urlFull = `${url}/`
    console.log("URL is set to ".blue + urlFull + "\nPort removal is FORCED per your configuration.".yellow)
} else {
    urlFull = `${url}:${port}/`
    console.log("URL is set to ".blue + urlFull + "\nTo force port removal, please edit your configuration.".blue)
}

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
  // In try/catch since if an upload is too large, originalname won't exist causing the application to crash. Mostly mitigated via use of PM2, but disruptive nonetheless.
  try {
    var safeName = regexSafety(req.file.originalname, /[|]/, /["]/, /[ ]/)
  } catch {
    console.log("File was too large!");
    return
  }

  var finalFile = `./content/uploads/${disc}-${safeName}`
  // Move file out of temp
  fs.rename(`./content/uploads/temp/${req.file.originalname}`, finalFile, function (err) {
    if (err) throw err
    console.log(`--\nUpload complete!\nUploaded to: ${finalFile}\n${req.file.originalname} --> ${disc}-${safeName}\n--`)
  })
  // Write registry entry
  fs.writeFile(`./content/registry/`+deletion, `${disc}-${safeName}`, (err) => {
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
  var path = './content/uploads/'+req.params.name;
try {
  stats = fs.statSync(path);
  res.render('share.ejs', {file: `${req.params.name}`, viewLink: `${urlFull}view/${req.params.name}`, downloadLink: `${urlFull}download/${req.params.name}`});
} catch {
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
  const directoryPath = "./content/uploads/";
  res.sendFile(fileName, { root: directoryPath }, (err) => {
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
  const directoryPath = "./content/uploads/";
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
  var path = './content/registry/'+regId;
try {
  stats = fs.statSync(path);
  var output = read('./content/registry/'+regId, function(data) {
      fs.unlink('./content/uploads/'+data, (err) => {
        if (err) {
          console.error(err)
          return
        }
      })
      fs.unlink('./content/registry/'+regId, (err) => {
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