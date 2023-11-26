const { MongoClient } = require('mongodb');
const dbConnect = require('./db/dbConnect');
require('dotenv').config()

const uri = process.env.DB_URL
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    console.log('____________________________________________________\nConnection to the server has been established\n____________________________________________________\n');

    const db = client.db();

    //insert a lobby a user has created
    await insertLobby("Come game with me!", "Rainbow Six Siege", "Let's come rank together", 5);

  } catch (e) {
    console.error(e);
  } finally {
    console.log('____________________________________________________\nConnection to the server has been closed\n____________________________________________________\n');
    await client.close();
  }
}

async function insertLobby(roomTitle, gameTitle, body, maxPlayers) {
  const db = client.db();
  try {
    const lobby = await db.collection('Lobbies').insertOne({
      roomTitle: roomTitle,
      gameTitle: gameTitle,
      body: body,
      maxPlayers: maxPlayers,
      date: Date()
    });
    const insertedLobby = await db.collection('Lobbies').findOne({ _id: lobby.insertedId }); // find by ID rather than anything else since we could return other things.
    console.log(`Lobby was successfully inserted! Title: ${insertedLobby.gameTitle}, Players: 1/${insertedLobby.maxPlayers}\n`);
  } catch (e) {
    console.error("Error inserting lobby:", e);
  }
  runUnitTests_insertLobby(roomTitle, gameTitle, body, maxPlayers);
}

async function getLobbyName() {
  const insertedLobby = await db.collection('Lobbies').findOne({ _id: lobby.insertedId });
  return insertedLobby.gameTitle;
}

async function runUnitTests_insertLobby(roomTitle, gameTitle, body, maxPlayers) {
  console.log("running unit tests for runUnitTests_insertLobby()");
  if (gameTitle == "Rainbow Six Siege") {
    console.log("Test 1 passed!");
  }  
  if (roomTitle == "Come game with me!") {
    console.log("Test 2 passed!");
  }
  if (body == "Let's come rank together") {
    console.log("Test 3 passed!");
  }
  if (maxPlayers == 5) {
    console.log("Test 4 passed!");
  }
}

main().catch(console.error);
