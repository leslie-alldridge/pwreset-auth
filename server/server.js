const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require('../config/local')
const authHelpers = require('../config/_helpers');

const server = express();

server.use(cors("*"));

server.use(bodyParser.json());
server.use(express.static(path.join(__dirname, "../public")));

server.post('/registerUser', (req, res, next) => {
    console.log('hit');
    
    return authHelpers.createUser(req, res)
  .then((response) => {
    passport.authenticate('local', (err, user, info) => {
      if (user) { handleResponse(res, 200, 'success'); }
    })(req, res, next);
  })
  .catch((err) => { handleResponse(res, 500, 'error'); });
});

function handleResponse(res, code, statusMsg) {
    res.status(code).json({status: statusMsg});
  }

module.exports = server;
