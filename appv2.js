const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./db/userModel");
const Lobby = require("./db/lobbyModel");
require('dotenv').config()
const auth = require("./auth");
var session = require('express-session')
const client = require("./bot.js");
const discordClient = client;
const dbConnect = require("./db/dbConnect");

const router = express.Router();
// execute database connection 
dbConnect();

/* Client Variables */
const client_id = '1154142275711021217'; // Paste your bot's ID here
const client_secret = process.env.CLIENT_SECRET; // Paste your bot's secret here
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)); 

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.CLIENT_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(router);
// Error handling middleware
app.use((err, req, res, next) => {
	// Handle errors here
	console.error(err.stack);
	res.status(400).send('Error with server.');
      });
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
module.exports = app;
  
