const request = require('supertest');
const jwt = require('jsonwebtoken');
const User = require("./db/userModel");
const auth = require("./auth");
const { JsonWebTokenError } = require('jsonwebtoken');

jest.mock("./db/userModel");

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