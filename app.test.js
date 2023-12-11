const request = require('supertest');
const jwt = require('jsonwebtoken');
const User = require("./db/userModel");
const Lobby = require("./db/lobbyModel")
const auth = require("./auth");
const { JsonWebTokenError } = require('jsonwebtoken');
const {ObjectId} = require('mongodb')
const{MongoClient} = require('mongodb')
const app = require('./app')
jest.mock("./db/userModel");

mongo_uri = process.env.DB_URL
dbName = "Auth_PPlayers"
describe('save-lobby', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(mongo_uri, {
      useNewUrlParser:true,
      useUnifiedTopology: true
    })
    db = await connection.db(dbName)
  });
  //3567
  afterAll(async()=>{
    await connection.close();
  })
  it('should insert lobby into the lobby collection', async()=>{
    const lobby = db.collection('lobbies')
    const mockLobby = new Lobby({roomTitle: 'room', gameTitle: 'game', body:'test description', maxPlayers: 3,})
    await lobby.insertOne(mockLobby);

    const insertedLobby = await users.findOne({_id: 'some-user-id'});
    expect(insertedLobby).toEqual(lobby);
  });
})
describe('GET /', () => {
  it('should respond with a message', async () => {
    const res = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.message).toEqual('Test response from server for getting root');
  });
});


describe('POST /register', () => {
  it('should register a new user and return a success message', async () => {
    User.mockImplementation(() => {
      return {
        save: jest.fn().mockResolvedValue({}),
      };
    });

    const res = await request(app)
      .post('/register')
      .send({ username: 'tucker', password: 'snowwww' })
      .expect('Content-Type', /json/)
      .expect(201);

    expect(res.body.message).toEqual('user created ');
  });
});

describe('POST /login', () => {
  it('should login a user', async () => {
    User.findOne.mockResolvedValue({
      username: 'tucker',
      password: 'snowwwbuthashed',
      _id: 'tuckerSnowID',
    });

    const res = await request(app)
      .post('/login')
      .send({ username: 'tucker', password: 'snowwww' })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.message).toEqual('Login Successful');
    expect(res.body.token).toBeDefined();
  });
});

describe('PUT /increasePlayers', () => {
  it('Increases the player count of a lobby by 1', async () => {
    // Create a test lobby
    const testLobby = insertLobby('Test Lobby', 'R6S', 'body msg', 4, 'gold', 'action');

    await testLobby.save();

    // Send a request to increase the number of players
    const res = await request(app)
      .put('/increasePlayers')
      .send({ roomTitle: 'Test Lobby'});

    // Check if the response has a status code of 200
    expect(res.statusCode).toBe(200);

    // Check if the number of players in the lobby has increased
    const updatedLobby = await Lobby.findOne({ roomTitle: 'Test Lobby' });
    expect(updatedLobby.currentPlayers).toBe(3);

    // Clean up the test lobby
    await testLobby.remove();
  });
});

describe('POST /create-lobby', () => {
  it('Should create a lobby and return the created lobby data', async () => {
    const requestBody = {
      roomTitle: 'Lobby 1',
      gameTitle: 'R6s',
      body: 'A lobby for R6s Ranked',
      maxPlayers: 5,
      rank: 'Diamond',
      genre: 'Action',
    };

    const response = await request(app)
      .post('/create-lobby')
      .send(requestBody);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.roomTitle).toBe('Lobby 1');
    expect(response.body.gameTitle).toBe('R6s');
    expect(response.body.body).toBe('A lobby for R6s Ranked');
    expect(response.body.maxPlayers).toBe(5);
    expect(response.body.rank).toBe('Diamond');
    expect(response.body.genre).toBe('Action');
  });
});
//test functionality of decreasePlayers when currentplayers is not 0.
describe('PUT /decreasePlayers', () => {
  it('Decreases player count of a lobby by 1', async () => {
    const testLobby = insertLobby('TestDecLobby', 'Rocket League', 'body_msg', 5, 'diamond', 'cars');

    await testLobby.save();
    
    // Send a requests to increase the number of players
    const res = await request(app)
      .put('/increasePlayers')
      .send({ roomTitle: 'Test Lobby'});
    
    res = await request(app)
      .put('/increasePlayers')
      .send({ roomTitle: 'Test Lobby'});
    
    const temp = testLobby.currentPlayers;
    
    //currentPlayers should be 2.
    res = await request(app)
      .put('/decreasePlayers')
      .send({ roomTitle: 'TestDecLobby'})

    expect(res.statusCode).toBe(201);

    const updatedLobby = await Lobby.findOne({ roomTitle: 'TestDecLobby'});
    expect(updatedLobby.currentPlayers).toBe(temp+1);
    
    await testLobby.remove();
  });
});

// test functionality of decreasePlayers when currentPlayers is 0;
describe('PUT /decreasePlayers', () => {
  it('Decreases player count of a lobby by 1', async () => {
    const testLobby = insertLobby('TestDecLobby', 'Rocket League', 'body_msg', 5, 'diamond', 'cars');

    await testLobby.save();
    
    //currentPlayers should be 0.
    const res = await request(app)
      .put('/decreasePlayers')
      .send({ roomTitle: 'TestDecLobby'})

    expect(res.statusCode).toBe(400);
	expect(res.body.message).toEqual('Cannot be removed because lobby size is zero.');
    const updatedLobby = await Lobby.findOne({ roomTitle: 'TestDecLobby'});
    expect(updatedLobby.currentPlayers).toBe(0);
    
    await testLobby.remove();
  });
});

//test functionality when decreasePlayers is requested for a lobby that does not exist.
describe('PUT /decreasePlayers', () => {
  it('Decreases player count of a lobby by 1', async () => {
    
    //testDecLobby is not a valid lobby.
    const res = await request(app)
      .put('/decreasePlayers')
      .send({ roomTitle: 'TestDecLobby'})

    expect(res.statusCode).toBe(400);
	expect(res.body.message).toEqual('No matching lobbies');
  });
});

// test increasePlayers when currentPlayers is below maximum
describe('PUT /increasePlayers', () => {
  it('Increases the player count of a lobby by 1', async () => {
    // Create a test lobby
    const testLobby = insertLobby('Test Lobby', 'R6S', 'body msg', 4, 'gold', 'action');

    await testLobby.save();
	
	const temp = testLobby.currentPlayers;
	
    // Send a request to increase the number of players
    const res = await request(app)
      .put('/increasePlayers')
      .send({ roomTitle: 'Test Lobby'});

    // Check if the response has a status code of 201
    expect(res.statusCode).toBe(201);

    // Check if the number of players in the lobby has increased
    const updatedLobby = await Lobby.findOne({ roomTitle: 'Test Lobby' });
    expect(updatedLobby.currentPlayers).toBe(temp+1);

    // Clean up the test lobby
    await testLobby.remove();
  });
});

//test increasePlayers when currentPlayers is at the maximum
describe('PUT /increasePlayers', () => {
  it('Increases the player count of a lobby by 1', async () => {
    // Create a test lobby
    const testLobby = insertLobby('Test Lobby', 'R6S', 'body msg', 1, 'gold', 'action');

    await testLobby.save();
	
    // Send a request to increase the number of players
    const res = await request(app)
      .put('/increasePlayers')
      .send({ roomTitle: 'Test Lobby'});
	
	const temp = testLobby.currentPlayers;
	
	//current players is at maximum, increasePlayers is called again.
	res = await request(app)
      .put('/increasePlayers')
      .send({ roomTitle: 'Test Lobby'});
    
    // Check if the response has a status code of 201
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toEqual('Cannot be added because lobby has reached max capacity. Please wait or join another lobby');

    // Check if the number of players in the lobby has not increased
    const updatedLobby = await Lobby.findOne({ roomTitle: 'Test Lobby' });
    expect(updatedLobby.currentPlayers).toBe(temp);

    // Clean up the test lobby
    await testLobby.remove();
  });
});

//test increasePlayers when lobby is not found
describe('PUT /increasePlayers', () => {
  it('Increases the player count of a lobby by 1', async () => {
    
    // Send a request to increase the number of players
    const res = await request(app)
      .put('/increasePlayers')
      .send({ roomTitle: 'Test Lobby'});
	
    // Check if the response has a status code of 400
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual('No matching lobbies');
  });
});

