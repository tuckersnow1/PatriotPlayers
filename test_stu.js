const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://quangasaurusrex:wKV6suTi7Mq1P6KQ@cluster0.bekfnez.mongodb.net/?retryWrites=true&w=majority";
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
    console.log(`Lobby was successfully inserted! Title: ${insertedLobby.gameTitle}, Players: 1/${insertedLobby.maxPlayers}`);
  } catch (e) {
    console.error("Error inserting lobby:", e);
  }
}

main().catch(console.error);