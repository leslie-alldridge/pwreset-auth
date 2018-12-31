const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const passport = require("passport");
const jwtSecret = require("../config/jwtConfig");
const jwt = require("jsonwebtoken");
const server = express();

const { findUser, userResetReq, deleteUser, userExists, updateUser } = require("./db/users");
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

server.post("/forgotpassword", (req, res, next) => {
  if (req.body.email === "") {
    res.json("email required");
  }
  console.log(req.body.email);
  findUser(req.body.email).then(user => {
    if (user === null) {
      console.log("email not in database");
      res.json("email not in db");
    } else {
      const token = crypto.randomBytes(20).toString("hex");
      userResetReq(req.body.email, token, Date.now() + 360000);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: `${process.env.EMAIL_ADDRESS}`,
          pass: `${process.env.EMAIL_PASSWORD}`
        }
      });

      const mailOptions = {
        from: `mySqlDemoEmail@gmail.com`,
        to: `${user.email}`,
        subject: `Link To Reset Password`,
        text:
          `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
          `Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n` +
          `http://localhost:3031/reset/${token}\n\n` +
          `If you did not request this, please ignore this email and your password will remain unchanged.\n`
      };

      console.log("sending mail");

      transporter.sendMail(mailOptions, function(err, response) {
        if (err) {
          console.error("there was an error: ", err);
        } else {
          console.log("here is the res: ", response);
          res.status(200).json("recovery email sent");
        }
      });
    }
  });
});

server.delete("/deleteuser", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      console.log(err);
    }
    if (info !== undefined) {
      console.log(info.message);
      res.send(info.message);
    } else {
      deleteUser(user.username)
        .then(user => {
          if (user === 1) {
            res.json("user deleted from db");
          } else {
            res.status(404).json("no user with that username to delete");
          }
        })
        .catch(err => {
          res.status(500).json(err);
        });
    }
  })(req, res, next);
});

server.put('/updateuser', (req, res, next) => {
  console.log('hit route');
  
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.log(err);
    }
    if (info != undefined) {
      console.log(info.message);
      res.send(info.message);
    } else {
      userExists(user.username).then(user => {
        if (user != null) {
          console.log('user found in db');
          updateUser(req.body.first_name,req.body.last_name,req.body.email)
            .then(() => {
              console.log('user updated');
              res.status(200).send({ auth: true, message: 'user updated' });
            });
        } else {
          console.log('no user exists in db to update');
          res.status(404).json('no user exists in db to update');
        }
      });
    }
  })(req, res, next);
});

module.exports = server;
