require('dotenv').config({path:"__dirname/.env"});
const fs = require('fs');
var colors = require('colors');
var colors = require('colors/safe');

const appName = process.env.applicationName;
const orgName = process.env.organizationName;

var home = `
<html lang="en">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.2/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
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
    <div class="titlebar">
      <a href="/history">
        <i class="fa-solid fa-list"></i> History </a>
    </div>
    <div class="jumbotron">
      <p align="center">
        <a>
          <img src="../icon.png" width="200" height="200" />
        </a>
      </p>
      <h1 align="center">Filing Saucer</h1>
      <div class="container col-sm-12" id="choose-files" oncopy="return false" oncut="return false" onpaste="return false">
        <form align="center" action="/uploadfile" method="post" enctype="multipart/form-data">
          <hr>
          <h4>Upload File:</h4>
          <input class="grayButton" style="border-radius: 4px;" type="file" name="file" id="uploads" multiple />
          <br>
          <br>
          <input class="blueButton" type="submit" name="upload" value="Upload">
        </form>
      </div>
    </div>
    <div class="jumbotron">
      <p align="center">
        <a href="https://github.com/Aerial-Laptop/Filing-Saucer/">
          <img alt="GitHub // Filing Saucer" src="https://img.shields.io/badge/GitHub-Filing%20Saucer-0099D2?style=for-the-badge" />
        </a>
      <details align="center">
        <summary>
          <b>Developer's Ask</b>
        </summary> Though not a requirement to satisfy the license of this project, Aerial Laptop, Enbyte, and all participating contributors to make this possible would greatly appreciate that the above badge remain visible on any modifications to this homepage. <br> In addition, we would love to talk to developers who self-host their instance for feedback on this software! Feel free to contact us via <b>aeriallaptop (a) enbyte.dev</b>
      </details>
      <details align="center">
        <summary>
          <b>Disclaimer / License</b>
        </summary> Aerial Laptop, Enbyte, and any other contributors/maintainers are not responsible for any aspect of user-hosted instances per "Disclaimer of Warranty" & "Limitation of Liability" in the <a href="https://www.gnu.org/licenses/agpl-3.0-standalone.html">AGPL-3.0-only</a>
        <a href="https://spdx.org/licenses/AGPL-3.0-only.html">(SPDX)</a> license.
      </details>
    </div>
    <p class="text-center text-muted">
      <small>Uploaded files are occasionally purged and furthermore are subject to manual deletion. The host bears no liability for files uploaded and distributed through Filing Saucer, an open source project.</small>
      <br>
    <p class="text-center text-muted">
      <small>If you suspect this application is being abused, please contact the email associated with this site's administrator.</small>
      <br>
    <p align="right">
      <a>
        <img src="../btmright.png" width="200" height="200" />
      </a>
    </p>
  </body>
  <style>
    .blueButton {
      background-color: #008CBA;
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
    }

    .grayButton {
      background-color: #696969;
      border: none;
      color: white;
      padding: 10px 16px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
    }

    .titlebar {
      overflow: hidden;
      background-color: #333;
    }

    .titlebar a {
      float: left;
      color: #f2f2f2;
      text-align: center;
      padding: 14px 16px;
      text-decoration: none;
      font-size: 24px;
    }
  </style>
</html>
`

var share = `
<html lang="en">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.2/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
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
    <div class="titlebar">
      <a href="/">
        <i class="fa-solid fa-arrow-left-long"></i> Home </a>
    </div>
    <div class="jumbotron">
      <p align="center">
        <a>
          <img src="../icon.png" width="200" height="200" />
        </a>
      </p>
      <h1 align="center">A File Has Been Shared With You!</h1>
      <div align="center" class="container col-sm-12" id="choose-files" oncopy="return false" oncut="return false" onpaste="return false">
        <hr>
        <h2><%= file %> </h2>
        <br>
        <h3>View File: </h3>
        <a href="<%= viewLink %>" target="_blank">
          <h4><%= file %> </h4>
        </a>
        <h3>Download File: </h3>
        <a href="<%= downloadLink %>" target="_blank">
          <h4><%= file %> </h4>
        </a>
      </div>
      <div class="jumbotron"></div>
      <p class="text-center text-muted">
        <small>Uploaded files are occasionally purged and furthermore are subject to manual deletion. The host bears no liability for files uploaded and distributed through Filing Saucer, an open source project.</small>
        <br>
      <p class="text-center text-muted">
        <small>If you suspect this application is being abused, please contact the email associated with this site's administrator.</small>
        <br>
      <p align="right">
        <a>
          <img src="../btmright.png" width="200" height="200" />
        </a>
      </p>
  </body>
  <style>
    .titlebar {
      overflow: hidden;
      background-color: #333;
    }

    .titlebar a {
      float: left;
      color: #f2f2f2;
      text-align: center;
      padding: 14px 16px;
      text-decoration: none;
      font-size: 24px;
    }
  </style>
</html>
`

var info = `
<html lang="en">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.2/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
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
    <div class="titlebar">
      <a href="/">
        <i class="fa-solid fa-arrow-left-long"></i> Home </a>
    </div>
    <div class="jumbotron">
      <p align="center">
        <a>
          <img src="../icon.png" width="200" height="200" />
        </a>
      </p>
      <h1 align="center"><%= title %> </h1>
      <div align="center" class="container col-sm-12" id="choose-files" oncopy="return false" oncut="return false" onpaste="return false">
        <hr>
        <h4><%= desc %> </h4>
      </div>
      <div class="jumbotron"></div>
      <p class="text-center text-muted">
        <small>Uploaded files are occasionally purged and furthermore are subject to manual deletion. The host bears no liability for files uploaded and distributed through Filing Saucer, an open source project.</small>
        <br>
      <p class="text-center text-muted">
        <small>If you suspect this application is being abused, please contact the email associated with this site's administrator.</small>
        <br>
      <p align="right">
        <a>
          <img src="../btmright.png" width="200" height="200" />
        </a>
      </p>
  </body>
  <style>
    .titlebar {
      overflow: hidden;
      background-color: #333;
    }

    .titlebar a {
      float: left;
      color: #f2f2f2;
      text-align: center;
      padding: 14px 16px;
      text-decoration: none;
      font-size: 24px;
    }
  </style>
</html>
`

var upload = `
<html lang="en">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.2/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
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
    <div class="titlebar">
      <a href="/">
        <i class="fa-solid fa-arrow-left-long"></i> Home </a>
    </div>
    <div class="jumbotron">
      <p align="center">
        <a>
          <img src="../icon.png" width="200" height="200" />
        </a>
      </p>
      <h1 align="center">File Uploaded</h1>
      <div align="center" class="container col-sm-12" id="choose-files" oncopy="return false" oncut="return false" onpaste="return false">
        <hr>
        <h3>Share File: </h3>
        <a href="<%= shareLink %>" target="_blank">
          <h4><%= shareLink %> </h4>
        </a>
        <br>
        <h3>Delete File: </h3>
        <a href="<%= deletionLink %>">
          <h4><%= deletionLink %> </h4>
        </a>
      </div>
      <div class="jumbotron"></div>
      <p class="text-center text-muted">
        <small>Uploaded files are occasionally purged and furthermore are subject to manual deletion. The host bears no liability for files uploaded and distributed through Filing Saucer, an open source project.</small>
        <br>
      <p class="text-center text-muted">
        <small>If you suspect this application is being abused, please contact the email associated with this site's administrator.</small>
        <br>
      <p align="right">
        <a>
          <img src="../btmright.png" width="200" height="200" />
        </a>
      </p>
  </body>
  <style>
    .titlebar {
      overflow: hidden;
      background-color: #333;
    }

    .titlebar a {
      float: left;
      color: #f2f2f2;
      text-align: center;
      padding: 14px 16px;
      text-decoration: none;
      font-size: 24px;
    }
  </style>
</html>
`

var history = `
<html lang="en">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.2/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
  <head>
    <meta charset="UTF-8">
    <title>${appName} Web Client</title>
    <meta property="og:title" content="View your history on ${appName}">
    <meta property="og:site_name" content="${appName}">
    <meta property="og:url" content="">
    <meta property="og:description" content="A file exchange webapp with easy upload and deletion!">
    <meta property="og:type" content="article">
    <meta property="og:image" content="./icon.png">
  </head>
  <body>
    <div class="titlebar">
      <a href="/">
        <i class="fa-solid fa-arrow-left-long"></i> Home </a>
    </div>
    <div class="jumbotron">
      <p align="center">
        <a>
          <img src="../icon.png" width="200" height="200" />
        </a>
      </p>
      <h1 align="center"><%= message %> </h1>
      <div align="center" style="width: 100%; display: table;">
        <div style="display: table-row">
          <div style="width: 600px;"><% for (var file of files) { %> <div class="file">
              <a href="/share/<%= file%>" target="_blank">
                <button class="blueButton">Open <br><%= file%> </button>
              </a>
            </div><% } %> </div>
          <div style="display: table-cell;">
            <div style="width: 600px;"><% for (var token of tokens) { %> <a href="/delete/<%= token%>">
                <div class="file">
                  <button class="deleteButton">Delete <br><%= file%> </button>
                </div>
              </a><% } %> </div>
          </div>
        </div>
      </div>
      <div class="jumbotron"></div>
      <p class="text-center text-muted">
        <small>Cookies must be enabled for this to function.</small>
        <br>
        <br>
      <p align="right">
        <a>
          <img src="../btmright.png" width="200" height="200" />
        </a>
      </p>
  </body>
  <style>
    .blueButton {
      background-color: #008CBA;
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
    }

    .deleteButton {
      background-color: #9f0000;
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
    }

    .titlebar {
      overflow: hidden;
      background-color: #333;
    }

    .titlebar a {
      float: left;
      color: #f2f2f2;
      text-align: center;
      padding: 14px 16px;
      text-decoration: none;
      font-size: 24px;
    }
  </style>
</html>
`

fs.writeFileSync(`./views/home.ejs`, home);
console.log("> ".green.bold+"Successfully created the home.ejs page.".grey);

fs.writeFileSync(`./views/info.ejs`, info);
console.log("> ".green.bold+"Successfully created the info.ejs page.".grey);

fs.writeFileSync(`./views/share.ejs`, share);
console.log("> ".green.bold+"Successfully created the share.ejs page.".grey);

fs.writeFileSync(`./views/upload.ejs`, upload);
console.log("> ".green.bold+"Successfully created the upload.ejs page.".grey);

fs.writeFileSync(`./views/history.ejs`, history);
console.log("> ".green.bold+"Successfully created the history.ejs page.".grey);
