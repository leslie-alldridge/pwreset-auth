const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const jwtSecret = require("../config/jwtConfig");
const jwt = require("jsonwebtoken");
const server = express();

const { findUser, userExists } = require("./db/users");
require('../config/passport');

server.use(cors("*"));

server.use(bodyParser.json());
server.use(express.static(path.join(__dirname, "../public")));
server.use(passport.initialize());

server.post("/register", (req, res, next) => {
  console.log("hit");

  passport.authenticate("register", (err, user, info) => {
    if (err) {
      console.log(err);
    }
    if (info != undefined) {
      console.log(info.message);
      res.send(info.message);
    } else {
      req.logIn(user, err => {
        // const data = {
        //   first_name: req.body.first_name,
        //   last_name: req.body.last_name,
        //   email: req.body.email,
        //   username: user.username
        // };
        // userExists(data.username).then(user => {
        //   user
        //     .update({
        //       first_name: data.first_name,
        //       last_name: data.last_name,
        //       email: data.email
        //     })
        //     .then(() => {
        //       console.log("user created in db");
        //       res.status(200).send({ message: "user created" });
        //     });
        // });
        res.status(200).send({
            
            message: "success"
          });
      });
    }
  })(req, res, next);
});

server.post("/login", (req, res, next) => {
  console.log("hit server ping");

  passport.authenticate("login", (err, user, info) => {
    if (err) {
      console.log(err);
      console.log("error is above");
    }
    if (info !== undefined) {
      console.log(info.message);
      res.send(info.message);
    } else {
        console.log(user);
        
      req.logIn(user, err => {
        findUser(user.email).then(user => {
            console.log(user);
            console.log('new');
            
          const token = jwt.sign({ id: user.username }, jwtSecret.secret);
          res.status(200).send({
            auth: true,
            token: token,
            message: "user found & logged in"
          });
        });
      });
    }
  })(req, res, next);
});

//   function handleLogin(req, user) {
//     return new Promise((resolve, reject) => {
//       req.login(user, (err) => {
//         if (err) reject(err);
//         resolve();
//       });
//     });
//   }

function handleResponse(res, code, statusMsg) {
  res.status(code).json({ status: statusMsg });
}

module.exports = server;
