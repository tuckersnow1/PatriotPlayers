const request = require('supertest');
const jwt = require('jsonwebtoken');
const User = require("./db/userModel");
const Lobby = require("./db/lobbyModel")
const auth = require("./auth");
const { JsonWebTokenError } = require('jsonwebtoken');
const {ObjectId} = require('mongodb')
const{MongoClient} = require('mongodb')
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
  //3
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