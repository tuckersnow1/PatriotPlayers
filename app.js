const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./db/userModel");
const auth = require("./auth");

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

// require database connection 
const dbConnect = require("./db/dbConnect");

// execute database connection 
dbConnect();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.post("/register", (request, response) => {
  bcrypt.hash(request.body.password, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data
      const user = new User({
        username: request.body.username,
        password: hashedPassword,
      });

      // save the new user
      user
        .save()
        // return success if the new user is added to the database successfully
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        // catch error if the new user wasn't added successfully to the database
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })

    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });

});

app.post("/login", (request, response) => {
  User.findOne({ username: request.body.username })
    .then((user) => {
      bcrypt.compare(request.body.password, user.password)
        .then((passwordCheck) => {

          // check if password matches
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Incorrect Password",
              error,
            });
          }
          else {
            //   create JWT token
            const token = jwt.sign(
              {
                userId: user._id,
                userUsername: user.username,
              },
              "RANDOM-TOKEN",
              { expiresIn: "24h" }
            );
            //   return success response
            response.status(200).send({
              message: "Login Successful",
              username: user.username,
              token,
            });
          }
        })
        .catch((error) => {
          response.status(400).send({
            message: "Incorrect Password",
            error,
          });
        })
    })
    .catch((e) => {
      response.status(404).send({
        message: "Username not found",
        e,
      });
    });

});
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});
module.exports = app;
