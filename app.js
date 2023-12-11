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
  Basic endpoint for server testing.
  */
  app.get("/", (request, response, next) => {
    response.json({ message: "Hey! This is your server response!" });
    next();
  });
  //     return next();
//   } else {
//     // Redirect or send an error response if the user is not logged in
//     res.redirect('/login');
//   }
// }

app.get('/auth/discord',async(req,res)=>{
  const code=req.query.code;
  const params = new URLSearchParams();
  let user;
  params.append('client_id', process.env.CLIENT_ID);
  params.append('client_secret', process.env.CLIENT_SECRET);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', "http://localhost:8000/auth/discord");
  try{
      const response=await axios.post('https://discord.com/api/oauth2/token',params)
      const { access_token,token_type}=response.data;
      const userDataResponse=await axios.get('https://discord.com/api/users/@me',{
          headers:{
              authorization: `${token_type} ${access_token}`
          }
      })
      console.log('Data: ',userDataResponse.data)
      user={
          username:userDataResponse.data.username,
          email:userDataResponse.data.email,
          avatar:`https://cdn.discordapp.com/avatars/350284820586168321/80a993756f84e94536481f3f3c1eda16.png`

      }
      res.redirect('/login');
      

  }catch(error){
      console.log('Error',error)
      return res.send('Some error occurred! ')
  }
})

  // app.get('/auth/discord',async (req,res)=>{
  //     // Parse the query parameters from the URL to get the authorization code
  //     const queryParams = new URLSearchParams(window.location.search);
  //     const authorizationCode = queryParams.get('code');
      
  // })
  // if (authorizationCode) {
  //     try {
  //         // Exchange the authorization code for an access token
  //         const response = await axios.post('https://discord.com/api/oauth2/token', {
  //             method: 'POST',
  //             headers: {
  //                 'Content-Type': 'application/x-www-form-urlencoded',
  //             },
  //             body: new URLSearchParams({
  //                 client_id: process.env.CLIENT_ID,
  //                 client_secret: process.env.CLIENT_SECRET,
  //                 code: authorizationCode,
  //                 grant_type: 'authorization_code',
  //                 redirect_uri: window.location.origin,
  //             }),
  //         });

  //         if (response.ok) {
  //             const data = await axios.get('https://discord.com/api/users/@me');
  //             const accessToken = data.access_token;
  //             console.log('Access Token:', accessToken);
  //             // use access token to make requests to the Discord API
  //         } else {
  //             console.error('Failed to exchange authorization code for access token');
  //         }
  //     } catch (error) {
  //         console.error('Error exchanging authorization code for access token:', error);
  //     }
  // }

// /* Draft code for discord oauth2. This is for the Discord Oauth2 function*/
// app.post('/user', (req, res) => { // Will run when there are any incoming POST requests to http://localhost:(port)/user. Note that a POST request is different from a GET request, so this won't exactly work when you actually visit http://localhost:(port)/user
//   /* Create our Form Data */
//   const data_1 = new URLSearchParams(); // Create a new formData object with the constructor
//   const code = req.body;
//   data_1.append('client_id', client_id); // Append the client_id variable to the data
//   data_1.append('client_secret', client_secret); // Append the client_secret variable to the data
//   data_1.append('grant_type', 'authorization_code'); // This field will tell the Discord API what you are wanting in your initial request.
//   data_1.append('redirect_uri', `http://localhost:3000`); // This is the redirect URL where the user will be redirected when they finish the Discord login
//   data_1.append('scope', 'identify'); // This tells the Discord API what info you would like to retrieve. You can change this to include guilds, connections, email, etc.
//   data_1.append('code', code) // This is a key parameter in our upcoming request. It is the code the user got from logging in. This will help us retrieve a token which we can use to get the user's info.

//   fetch('https://discord.com/api/oauth2/token', { method: "POST", body: data_1 }).then(response => response.json())
//   .then( 
//     async data => { 
//       const discordAccessTok = data.access_token;
//       // Make a request to the Discord API with the form data, convert the response to JSON, then take it and run the following code.
//       axios.get("https://discord.com/api/users/@me", make_config(discordAccessTok)).then(async response => { // Make a request yet again to the Discord API with the token from previously.
//         const discordUsername = response.data.username;
//         if(await User.findOne({ discordUsername })){
//           res.status(200).send("User exists.")
//         }
//         else{
//           const createdUser = new User({discordUsername});
//           createdUser.save()
//           res.status(200).send("Created user: " + response.data.username);
//         }
//         res.redirect('/login');
//         // return res.status(200).send(response.data.username); // Send the username with a status code 200.
//       }).catch(err => { // Handle any errors in the request (such as 401 errors).
//           console.log(err); // Log the error in the console
//           res.sendStatus(500); // Send a 500 error.
//       });
//   });
// });
/**
 * This method attempts to insert a new lobby with attributes given by a user into the database.
 * The attributes needed are: roomTitle, gameTitle, body, maxPlayers, rank, and genre.
 * Logs a corresponding success or error message.
 */
async function insertLobby(roomTitle, gameTitle, body, maxPlayers, rank, genre) {
  try{
    const insertedLobby = new Lobby({
      roomTitle: roomTitle,
      gameTitle: gameTitle,
      body: body,
      maxPlayers: maxPlayers,
      currentPlayers: 0,
      rank: rank,
      genre: genre,
      date: Date(),
    });
    await insertedLobby.save(); // Return the created lobby
    console.log(`Lobby was successfully inserted! Title: ${insertedLobby.gameTitle}, Players: 1/${insertedLobby.maxPlayers}`);
  } catch (e) {
    console.error("Error inserting lobby:", e);
  }
  
}
/**
 * This endpoint uses the insertLobby function to create a Lobby with given attributes and save it.
 * An error is reported if any error occurred during this process.
 */
app.post('/create-lobby', async (req, res) => {
  const { roomTitle, gameTitle, body, maxPlayers, rank, genre } = req.body;
  
  try {
    const lobby = await insertLobby(roomTitle, gameTitle, body, maxPlayers, rank, genre);
    res.status(201).json(lobby);
    client.emit('channel', roomTitle, 'text', 'create');                     // creates voice channel with roomTitle
    client.emit('channel', roomTitle, 'voice', 'create');                     // creates text channel with roomTitle

    // discordClient.emit('channel', roomTitle, 'voice', 'create');
    
  } catch (e) {
    console.error('Error:', e);
    res.status(400).json({ message: 'Error creating lobby' });
  }
});

app.post('/message-invite', async (req, res) => {
  const { message, username } = req.body;

  try {
    client.emit('sendDm', message, username);
  }
  catch(error){
    res.status(400).json({message: error.message});
  }
})

/**
 * Retrieves a lobby from the database and deletes it.
 * If the lobby cannot be found by its ID, an error is reported.
 */
app.delete('/remove-lobby', async (req, res) => {
  try {
      const lobbyId = req.body.id; // Get lobby ID from the request body
      const lobby = await Lobby.findByIdAndDelete(lobbyId); // Delete the lobby from the database

      res.status(201).json(lobby); // Send back the deleted lobby data
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
})
/**
 * Retrieves user info from the database by their ID. 
 * If the user info cannot be found by their ID, an error is reported.
 */
app.get('/get-user', async (req, res) => {
  try {
      // const user = await User.findOne({username:req.body.username}); // Find the user by their ID
      const user = await User.findById(req.body.userId); // Find the user by their ID
      res.status(201).json(user); // Send back the user data
  } catch (error) {
      res.status(400).json({ message: error.message });
  }});

  /**
 * This endpoint increases the current player count in a lobby by one.
 * It returns error messages if the lobby does not exist in the database or the increase would violate the lobby's maximum player count.
 */
app.put('/increasePlayers', async(req, res) => {
  let request = req;
  let response = res;
  try{
    let lobbyName = request.body.lobbyName;
    if(lobbyName!=null){
      var lobby = await Lobby.findOne({roomTitle: lobbyName});
      // console.log(lobby);
      if(lobby==null) {
        return response.status(400).send({
          message: "No matching lobbies",
          error,
        });
      }
      else{
        console.log("Comparing currentPlayers to maxPlayers")
        if(lobby.currentPlayers<lobby.maxPlayers){
          lobby.currentPlayers+=1
          await lobby.save()
          console.log("Updated players to: " + lobby.currentPlayers)
          return res.status(201).send({
            message: "Current Players increased successfully",
            data: lobby,
          });
        }
        else if(lobby.currentPlayers==lobby.maxPlayers){
          console.log("Equals capacity")
          lobby.currentPlayers+=0
           await lobby.save()
           return response.status(201).send({
            message: "Cannot be added because lobby has reached max capacity. Please wait or join another lobby",
          });
        }
        else{
          console.log("None of the following!")
        }
      }
    }
  }
  catch(error){
    res.status(400).send({
      message: "Could not complete operation.",
      error: error.message,
    });
  };

})
/**
 * This endpoint decreases the current player count in a lobby by one.
 * It returns error messages if the lobby does not exist in the database or the current player count is zero.
 */
app.put('/decreasePlayers', async(req, res) => {
  let request = req;
  let response = res;
  try{
    let lobbyName = request.body.lobbyName;
    if(lobbyName!=null){
      var lobby = await Lobby.findOne({roomTitle: lobbyName});
      console.log(lobby);
      // if(lobby.length==0) {
      if(lobby==null) {
        return response.status(400).send({
          message: "No matching lobbies",
          error,
        });
      }
      else{
        if(lobby.currentPlayers>0){
          lobby.currentPlayers-=1
          await lobby.save()
          return res.status(201).send({
            message: "Current Players decreased successfully",
            data: lobby,
          });
        }
        else if(lobby.currentPlayers==0){
           response.status(400).send({
            message: "Cannot be removed because lobby size is zero.",
          });
        }
      }
    }
  }
  catch(error){
    res.status(400).send({
      message: "Could not complete operation.",
      error: error.message,
    });
  };

})

/**
 * This attribute searches the lobbies based on query from the frontend. 
 * It finds all the matching lobbies from mongodb, and then sorts them in ascending order.
 * if there is no query parameter, then all the lobbies are returned as the search results.
 * 
 */
app.get('/search', async(req, res)=> {
  let request = req;
  let response = res;
  try{
    let query = request.body;
    if(query!=null){
      var lobbies = await Lobby.find(query).sort({"roomTitle":1})
      // var lobbies = await Lobby.find(query).sort({filter: 1});
      // console.log(lobbies);
      if(lobbies.length==0) {
        return response.status(400).send({
          message: "No matching lobbies",
          error,
        });
      }
      else{
        response.json(lobbies);
      }
    }
    else{
      var lobbies = await Lobby.find({});
      res.json(lobbies)
    }}
    catch(error){
      response.status(400).send({
        message: "No Lobbies found",
        error: error.message,
      });
    };
  
  });
  
  
  /**
   * This endpoint filters the lobbies either by: all current lobby data, or by certain filter.
   * The request parameters include filter query and order attribute. 
   * The filter(rank, genre, maxPlayers) will be decided and sent from React JS frontend to here.
   * The same goes for the order type(ascending, descending, alphabetical) if the user tries to further organize the filter results of the lobbies.
   * The request body is: {query:, filter:, order:}
   */
  app.get('/filter', async(req, res)=> {
    try {
    const filter = req.body.filter;
    const order = req.body.order;
    const query = req.body.query;
    if(req.body!=null){
      if(filter==null){
        var lobbies = await Lobby.find(query).sort([["gameTitle", 1]])
      }
      else{
        var lobbies = await Lobby.find(query).sort([[filter, order]])
      }
      res.status(201).json({
        message: "Lobbies filtered successfully",
        data: lobbies,
      });
    }
    else{
      res.status(400).send({
        message: "Please enter a valid filter.",
      });
    }
  }
  catch(error){
    res.status(400).send({
      message: "No Lobbies Found.",
      error: error.message,
    });
  };
});

/**
 * User filters by popular lobbies. This endpoint retrieves all the lobbies in mongodb and sorts them by the currentPlayers attribute by descending order.
 * Sends success and error messages accordingly.
 */
  app.get('/popular', async(req, res)=> {
    try {
      var lobbies = await Lobby.find({}).sort([["currentPlayers", -1]])
      res.status(201).json({
        message: "Lobbies filtered successfully",
        data: lobbies,
      });
  }
  catch(error){
    res.status(400).send({
      message: "No Lobbies Found or Invalid Request.",
      error: error.message,
    });
  };
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
  
