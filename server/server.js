const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const jwtSecret = require("../config/jwtConfig");
const jwt = require("jsonwebtoken");
const server = express();

const { findUser } = require("./db/users");
require("../config/passport");

server.use(cors("*"));

server.use(bodyParser.json());
server.use(express.static(path.join(__dirname, "../public")));
server.use(passport.initialize());

server.post("/register", (req, res, next) => {
  passport.authenticate("register", (err, user, info) => {
    if (err) {
      console.log(err);
    }
    if (info !== undefined) {
      res.send(info.message);
    } else {
      req.logIn(user, err => {
        res.status(200).send({
          message: "success"
        });
      });
    }
  })(req, res, next);
});

server.post("/login", (req, res, next) => {
  passport.authenticate("login", (err, user, info) => {
    if (err) {
      console.log(err);
    }
    if (info !== undefined) {
      res.send(info.message);
    } else {
      req.logIn(user, err => {
        findUser(user.email).then(user => {
            console.log(user);
            console.log('read above');
            
          const token = jwt.sign({ id: user[0].username }, jwtSecret.secret);
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

server.get("/finduser", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      console.log(err);
    }
    if (info !== undefined) {
      console.log(info.message);
      res.send(info.message);
    } else {
      console.log("user found in db from findUsers");
      res.status(200).send({
        auth: true,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        username: user.username,
        password: user.password,
        message: "user found in db"
      });
    }
  })(req, res, next);
});

module.exports = server;
