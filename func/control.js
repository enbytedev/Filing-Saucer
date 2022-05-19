const uploadFile = require("./upload");
const fs = require('fs')

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
  // Respond to client
  res.status(200).send({
    message: `${disc}-${safeName}|${deletion}`,
  });
};

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
      res.status(500).send({
        message: "Could not view the requested file... " + err,
      });
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
      res.status(500).send({
        message: "Could not download the requested file... " + err,
      });
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
  res.status(200).send({
    message: `Deleted | ${regId}`,
  });
};

module.exports = {
  upload,
  view,
  download,
  deletion,
};