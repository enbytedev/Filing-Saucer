const uploadFile = require(`${__scriptsDir}/routing/uploadMiddleware.js`);
const fs = require('fs');
var colors = require('colors');

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
      console.log("> ".green.bold+`Upload complete: ${finalFile}`.gray);
    })
    // Write registry entry
    fs.writeFile(`./content/registry/`+deletion, `${disc}-${safeName}`, (err) => {
      if (err) {
        throw err;
      }
    })
  try {
    res.cookie(`${deletion}`, `${disc}-${safeName}`, {
      maxAge: 17280000 * 1000, // 200 days
      httpOnly: true,
      secure: false
  });
  } catch {
    console.log("X ".red.bold+`Failed to send cookie to uploader of  ${finalFile}.`.gray);
  }
  res.render('upload.ejs', {shareLink: `${urlFull}share/${disc}-${safeName}`, deletionLink: `${urlFull}delete/${deletion}`});
  };

  module.exports = { upload };