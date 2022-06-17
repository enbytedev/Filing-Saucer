require('dotenv').config({path:"__dirname/.env"});
const fs = require('fs');
var colors = require('colors');
var colors = require('colors/safe');

const appName = process.env.applicationName;
const orgName = process.env.organizationName;

var web = `
<html lang="en">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.2/css/bootstrap.min.css">
<head>
    <meta charset="UTF-8">
    <title>${appName} Web Client</title>
  <meta property="og:title" content="${appName} Web Client">
  <meta property="og:site_name" content="">
  <meta property="og:url" content="">
  <meta property="og:description" content="A file exchange webapp with easy upload and deletion!">
  <meta property="og:type" content="article">
  <meta property="og:image" content="">
</head>
<body>
  <div class="jumbotron">
    <p align="center"><a><img src="../icon.png" width="200" height="200" /></a></p>
    <h1 align="center">Filing Saucer</h1>
<div class="container col-sm-12" id="choose-files" oncopy="return false" oncut="return false" onpaste="return false">
    <form align="center" action="/uploadfile" method="post" enctype="multipart/form-data">
      <hr>
      <h4>Upload File:</h4>
      <input class="btn btn-secondary" type="file" name="file" id="uploads" multiple/>
      <br><br>
      <input class="btn btn-primary" type="submit" style="border-radius: 4px;" name="upload" value="Upload">
    </form>
      <p class="text-center"><small>IF YOU'VE LOST YOUR DELETION LINK, PLEASE USE<br>/delete/(token)<br>IF YOU HAVE LOST YOUR TOKEN, PLEASE CONTACT THE SITE ADMINISTRATOR</small>
  </div>
</div>
  <div class="jumbotron">
    <p align="center">
      <a href="https://github.com/Aerial-Laptop/Filing-Saucer/">
        <img alt="GitHub // Filing Saucer" src="https://img.shields.io/badge/GitHub-Filing%20Saucer-0099D2?style=for-the-badge" />
      </a>
      <details align="center">
        <summary><b>Developer's Ask</b></summary>
        Though not a requirement to satisfy the license of this project, Aerial Laptop, Enbyte, and all participating contributors to make this possible would greatly appreciate that the above badge remain visible on any modifications to this homepage. <br>
          In addition, we would love to talk to developers who self-host their instance for feedback on this software! Feel free to contact us via <b>aeriallaptop (a) enbyte.dev</b>
      </details>
<details align="center">
          <summary><b>Disclaimer / License</b></summary>
          Aerial Laptop, Enbyte, and any other contributors/maintainers are not responsible for any aspect of user-hosted instances per "Disclaimer of Warranty" & "Limitation of Liability" in the <a href="https://www.gnu.org/licenses/agpl-3.0-standalone.html">AGPL-3.0-only</a> <a href="https://spdx.org/licenses/AGPL-3.0-only.html">(SPDX)</a> license.
        </details>
  </div>
  <p class="text-center text-muted"><small>Uploaded files are occasionally purged and furthermore are subject to manual deletion. The host bears no liability for files uploaded and distributed through Filing Saucer, an open source project.</small><br>
  <p class="text-center text-muted"><small>If you suspect this application is being abused, please contact the email associated with this site's administrator.</small>
    <br>
    <p align="right"><a><img src="../btmright.png" width="200" height="200" /></a></p>
</body>
</html>
`

var info = `
<html lang="en">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.2/css/bootstrap.min.css">
<head>
    <meta charset="UTF-8">
    <title>${appName} Web Client</title>
  <meta property="og:title" content="File shared via ${appName}">
  <meta property="og:site_name" content="${appName}">
  <meta property="og:url" content="">
  <meta property="og:description" content="A file exchange webapp with easy upload and deletion!">
  <meta property="og:type" content="article">
  <meta property="og:image" content="./icon.png">
</head>
<body>
  <div class="jumbotron">
    <p align="center"><a><img src="../icon.png" width="200" height="200" /></a></p>
    <h1 align="center"><%= title %></h1>
<div align="center" class="container col-sm-12" id="choose-files" oncopy="return false" oncut="return false" onpaste="return false">
      <hr>
      <h4><%= desc %></h4>
</div>
  <div class="jumbotron">
  </div>
  <p class="text-center text-muted"><small>Uploaded files are occasionally purged and furthermore are subject to manual deletion. The host bears no liability for files uploaded and distributed through Filing Saucer, an open source project.</small><br>
  <p class="text-center text-muted"><small>If you suspect this application is being abused, please contact the email associated with this site's administrator.</small>
    <br>
    <p align="right"><a><img src="../btmright.png" width="200" height="200" /></a></p>
</body>
</html>
`

var share = `
<html lang="en">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.2/css/bootstrap.min.css">
<head>
    <meta charset="UTF-8">
    <title>${appName} Web Client</title>
  <meta property="og:title" content="File shared via ${appName}">
  <meta property="og:site_name" content="${appName}">
  <meta property="og:url" content="">
  <meta property="og:description" content="A file has been shared With you!">
  <meta property="og:type" content="article">
  <meta property="og:image" content="../icon.png">
</head>
<body>
  <div class="jumbotron">
    <p align="center"><a><img src="../icon.png" width="200" height="200" /></a></p>
    <h1 align="center">A File Has Been Shared With You!</h1>
<div align="center" class="container col-sm-12" id="choose-files" oncopy="return false" oncut="return false" onpaste="return false">
      <hr>
      <h2><%= file %></h2>
      <br>
      <h3>View File: </h3><a href="<%= viewLink %>" target="_blank"><h4><%= file %></h4></a>
      <h3>Download File: </h3><a href="<%= downloadLink %>" target="_blank"><h4><%= file %></h4></a>
</div>
  <div class="jumbotron">
  </div>
  <p class="text-center text-muted"><small>Uploaded files are occasionally purged and furthermore are subject to manual deletion. The host bears no liability for files uploaded and distributed through Filing Saucer, an open source project.</small><br>
  <p class="text-center text-muted"><small>If you suspect this application is being abused, please contact the email associated with this site's administrator.</small>
    <br>
    <p align="right"><a><img src="../btmright.png" width="200" height="200" /></a></p>
</body>
</html>
`

var upload = `
<html lang="en">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.2/css/bootstrap.min.css">
<head>
    <meta charset="UTF-8">
    <title>${appName} Web Client</title>
  <meta property="og:title" content="File shared via ${appName}">
  <meta property="og:site_name" content="${appName}">
  <meta property="og:url" content="">
  <meta property="og:description" content="A file exchange webapp with easy upload and deletion!">
  <meta property="og:type" content="article">
  <meta property="og:image" content="../icon.png">
</head>
<body>
  <div class="jumbotron">
    <p align="center"><a><img src="../icon.png" width="200" height="200" /></a></p>
    <h1 align="center">File Uploaded</h1>
<div align="center" class="container col-sm-12" id="choose-files" oncopy="return false" oncut="return false" onpaste="return false">
      <hr>
      <h3>Share File: </h3><a href="<%= shareLink %>" target="_blank"><h4><%= shareLink %></h4></a>
      <br>
      <h3>Delete File: </h3><a href="<%= deletionLink %>"><h4><%= deletionLink %></h4></a>
</div>
  <div class="jumbotron">
  </div>
  <p class="text-center text-muted"><small>Uploaded files are occasionally purged and furthermore are subject to manual deletion. The host bears no liability for files uploaded and distributed through Filing Saucer, an open source project.</small><br>
  <p class="text-center text-muted"><small>If you suspect this application is being abused, please contact the email associated with this site's administrator.</small>
    <br>
    <p align="right"><a><img src="../btmright.png" width="200" height="200" /></a></p>
</body>
</html>
`

// var createStream = fs.createWriteStream(`./views/web.ejs`);
// createStream.end();
fs.writeFileSync(`./views/web.ejs`, web);
console.log("> ".green.bold+"Successfully created the web.ejs page.".grey);

fs.writeFileSync(`./views/info.ejs`, info);
console.log("> ".green.bold+"Successfully created the info.ejs page.".grey);

fs.writeFileSync(`./views/share.ejs`, share);
console.log("> ".green.bold+"Successfully created the share.ejs page.".grey);

fs.writeFileSync(`./views/upload.ejs`, upload);
console.log("> ".green.bold+"Successfully created the upload.ejs page.".grey);