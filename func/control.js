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

  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "Attempted to upload a file that is too large!",
      });
    }
    res.status(500).send({
      message: `Failed to upload file: ${req.file.originalname}. ${err}`,
    });
  }
  let disc = `${generate(6)}`
  let deletion = `${generate(8)}`
  let tempFile = `uploads/temp/${req.file.originalname}`
  const reg0 = /[|]/
  const reg1 = /["]/
  let nameFix0 = req.file.originalname.replace(reg0, "-")
  let nameFix1 = nameFix0.replace(reg1, "-")
  var discFile = `uploads/${disc}-${nameFix1}`
  fs.rename(tempFile, discFile, function (err) {
    if (err) throw err
    console.log(`--\nUpload complete!\nUploaded to: ${discFile}\n${req.file.originalname} --> ${disc}-${nameFix1}\n--`)
  })
  fs.writeFile(`./registry/`+deletion, `${disc}-${nameFix1}`, (err) => {
    if (err) {
      throw err;
    }
  })
  res.status(200).send({
    message: `${disc}-${nameFix1}|${deletion}`,
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
  
  var output = read(__basedir+'/registry/'+regId, function(data) {
    fs.unlink(__basedir+'/uploads/'+data, (err) => {
      if (err) {
        console.error(err)
        return
      }
    })
    fs.unlink(__basedir+'/registry/'+regId, (err) => {
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
  download,
  deletion,
};