const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./db/userModel");
const Lobby = require("./db/lobbyModel");

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
app.post('/create-lobby', async (req, res) => {
  const { roomTitle, gameTitle, body, maxPlayers, rank, genre } = req.body;
  
  try {
    const lobby = await insertLobby(roomTitle, gameTitle, body, maxPlayers, rank, genre);
    res.status(201).json(lobby);
    
  } catch (e) {
    console.error('Error:', e);
    res.status(400).json({ message: 'Error creating lobby' });
  }
});

app.get('/search', async(req, res)=> {
  let request = req;
  let response = res;
  try{
    const query = request.body;
    if(query!=null){
      var lobbies = await Lobby.find(query).sort({roomTitle:1})
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
        message: "Error searching lobbies: Invalid Query or Lobbies don't exist",
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
    
    // async function insertLobby(roomTitle, gameTitle, body, maxPlayers) {
    //   try {
    
    //     const lobby = new Lobby({
    //         roomTitle: roomTitle,
    //         gameTitle: gameTitle,
    //         body: body,
    //         maxPlayers: maxPlayers,
    //         date: Date()
    //     })
    //     lobby
    //     .save()
    //         .then((result) => {
    //           response.status(201).send({
    //             message: "Lobby Created Successfully",
    //             result,
    //           });
    //         })
    //         .catch((error) => {
    //           response.status(400).send({
    //             message: "Please make sure you enter valid attributes when creating a",
    //             error,
    //           });
    //         });
    //     // const lobby = await db.collection('Lobbies').insertOne({
    //     //   roomTitle: roomTitle,
    //     //   gameTitle: gameTitle,
    //     //   body: body,
    //     //   maxPlayers: maxPlayers,
    //     //   date: Date()
    //     // });
    //     const insertedLobby = null; // find by ID rather than anything else since we could return other things.
    //     console.log(`Lobby was successfully inserted! Title: ${insertedLobby.gameTitle}, Players: 1/${insertedLobby.maxPlayers}`);
    //   } catch (e) {
    //     console.error("Error inserting lobby:", e);
    //   }
    // }