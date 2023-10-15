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

/*
Basic endpoint for server testing.
*/
app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

// require database connection 
const dbConnect = require("./db/dbConnect");

// execute database connection 
dbConnect();

/**
 * This method configures all the CORS and HTTP headers/methods.
 * The 1st setHeader specifies from which origins can make requests to our server. We have set this to anywhere for now.
 * 2nd setHeader -> Which HTTP headers can be used.
 * 3rd setHeader -> Specifies Which HTTP methods are allowed for those requests
 * next() -> calls next method in stack.
 */
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
/*
       create a new user instance and collect the data
       save the new user
       return success if the new user is added to the database successfully
       catch error if the new user wasn't added successfully to the database
*/
app.post("/register", (request, response) => {
  bcrypt.hash(request.body.password, 10)
    .then((hashedPassword) => {
      const user = new User({
        username: request.body.username,
        password: hashedPassword,
      });
      user
        .save()
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        .catch((error) => {
          response.status(400).send({
            message: "Error creating user",
            error,
          });
        });
    })
    .catch((e) => {
      response.status(400).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});


/*
User collection attempts to find username in db which matches the one in the user's request
Using the bcrypt method to decrypt the encrypted password in the database and check if it matches the one from the request
If password not matches, then Exception thrown for incorrect password
Else, the user is granted a special Json Web Token (JWT) which authenticates and authorizes the user
*/
app.post("/login", (request, response) => {
  User.findOne({ username: request.body.username })
    .then((user) => {
      bcrypt.compare(request.body.password, user.password)
        .then((passwordCheck) => {
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Incorrect Password",
              error,
            });
          }
          else {
            const token = jwt.sign(
              {
                userId: user._id,
                userUsername: user.username,
              },
              "RANDOM-TOKEN",
              { expiresIn: "24h" }
            );
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

app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});
module.exports = app;
