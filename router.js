const express = require("express");
const router = express.Router();

// ... (all your route definitions)


router.use((req, res, next) => {
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
function make_config(authorization_token) { // Define the function
	data = { // Define "data"
	    headers: { // Define "headers" of "data"
		"authorization": `Bearer ${authorization_token}` // Define the authorization
	    }
	};
	return data; // Return the created object
      }
      
      /*
      Basic endpoint for server testing.
      */
      router.get("/", (request, response, next) => {
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
      
      function requireLogin(req, res, next) {
	if (req.session && req.session.user) {
	  // User is logged in, proceed to the next middleware or route handler
	  return next();
	} else {
	  // Redirect or send an error response if the user is not logged in
	  res.redirect('/login');
	}
      }
      
      /* Draft code for discord oauth2. This is for the Discord Oauth2 function*/
      router.post('/user', (req, res) => { // Will run when there are any incoming POST requests to http://localhost:(port)/user. Note that a POST request is different from a GET request, so this won't exactly work when you actually visit http://localhost:(port)/user
	/* Create our Form Data */
	const data_1 = new URLSearchParams(); // Create a new formData object with the constructor
	const code = req.body;
	data_1.append('client_id', client_id); // Append the client_id variable to the data
	data_1.append('client_secret', client_secret); // Append the client_secret variable to the data
	data_1.append('grant_type', 'authorization_code'); // This field will tell the Discord API what you are wanting in your initial request.
	data_1.append('redirect_uri', `http://localhost:3000`); // This is the redirect URL where the user will be redirected when they finish the Discord login
	data_1.append('scope', 'identify'); // This tells the Discord API what info you would like to retrieve. You can change this to include guilds, connections, email, etc.
	data_1.append('code', code) // This is a key parameter in our upcoming request. It is the code the user got from logging in. This will help us retrieve a token which we can use to get the user's info.
      
	fetch('https://discord.com/api/oauth2/token', { method: "POST", body: data_1 }).then(response => response.json())
	.then( 
	  async data => { 
	    const discordAccessTok = data.access_token;
	    // Make a request to the Discord API with the form data, convert the response to JSON, then take it and run the following code.
	    axios.get("https://discord.com/api/users/@me", make_config(discordAccessTok)).then(async response => { // Make a request yet again to the Discord API with the token from previously.
	      const discordUsername = response.data.username;
	      if(await User.findOne({ discordUsername })){
		res.status(200).send("User exists.")
	      }
	      else{
		const createdUser = new User({discordUsername});
		createdUser.save()
		res.status(200).send("Created user: " + response.data.username);
	      }
	      res.redirect('/login');
	      // return res.status(200).send(response.data.username); // Send the username with a status code 200.
	    }).catch(err => { // Handle any errors in the request (such as 401 errors).
		console.log(err); // Log the error in the console
		res.sendStatus(500); // Send a 500 error.
	    });
	});
      });
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
      router.post('/create-lobby', async (req, res) => {
	const { roomTitle, gameTitle, body, maxPlayers, rank, genre } = req.body;
	
	try {
	  const lobby = await insertLobby(roomTitle, gameTitle, body, maxPlayers, rank, genre);
	  res.status(201).json(lobby);
	  discordClient.emit('channel', roomTitle, 'voice', 'create');
	  
	} catch (e) {
	  console.error('Error:', e);
	  res.status(400).json({ message: 'Error creating lobby' });
	}
      });
      
      router.post('/message-invite', async (req, res) => {
	const { message, username } = req.body;
      
	try {
	  discordClient.emit('sendDm', message, username);
	}
	catch(error){
	  res.status(400).json({message: error.message});
	}
      })
      
      /**
       * Retrieves a lobby from the database and deletes it.
       * If the lobby cannot be found by its ID, an error is reported.
       */
      router.delete('/remove-lobby', async (req, res) => {
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
      router.get('/get-user', async (req, res) => {
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
      router.put('/increasePlayers', async(req, res) => {
	let request = req;
	let response = res;
	try{
	  let lobbyName = request.body.lobbyName;
	  if(lobbyName!=null){
	    var lobby = await Lobby.findOne({roomTitle: lobbyName});
	    console.log(lobby);
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
		 response.status(400).send({
		  message: "Cannot be added because lobby has reached max capacity. Please wait or join another lobby",
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
       * This endpoint decreases the current player count in a lobby by one.
       * It returns error messages if the lobby does not exist in the database or the current player count is zero.
       */
      router.put('/decreasePlayers', async(req, res) => {
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
      router.get('/search', async(req, res)=> {
	let request = req;
	let response = res;
	try{
	  let query = request.body;
	  if(query!=null){
	    var lobbies = await Lobby.find(query).sort({"roomTitle":1})
	    // var lobbies = await Lobby.find(query).sort({filter: 1});
	    console.log(lobbies);
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
	router.get('/filter', async(req, res)=> {
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
	router.get('/popular', async(req, res)=> {
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
      router.post("/register", (request, response) => {
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
      router.post("/login", (request, response) => {
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
	  router.get("/free-endpoint", (request, response) => {
	    response.json({ message: "You are free to access me anytime" });
	  });
	  
	  router.get("/auth-endpoint", auth, (request, response) => {
	    response.json({ message: "You are authorized to access me" });
	  });
module.exports = router;