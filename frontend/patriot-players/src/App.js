import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import axios from 'axios';
import './index.css';

function App() {
  // Dummy data for game sessions
  const [gameSessions, setGameSessions] = useState(
    [{ id: 1, roomTitle: "Let's play Rainbow Six Siege", gameTitle: "Rainbow Six Siege", body:"Mason Students playing Rainbow Six", genre: "Adventure",rank: "Prestige",currentPlayers: 5, maxPlayers: 15 },
    { id: 2, roomTitle: "Let's play Call of Duty", gameTitle: "Call of Duty", body:"Mason Students playing COD", genre:"RPG", rank:"Amateur", currentPlayers: 10, maxPlayers: 25 },]
    // ... add more game sessions as needed
  );
  useEffect(() => {
    // Fetch current lobbies when the component mounts
    fetchLobbies();
  }, []);

  const handleJoin = async (lobbyName) => {
    try {
      await axios.put('http://localhost:3000/increasePlayers', { lobbyName });
      fetchLobbies(); // Fetch updated lobby after increasePlayers
    } catch (error) {
      console.error('Error joining lobby:', error);
    }
  };
  const fetchLobbies = async () => {
    try {
      // Make a GET request to fetch lobbies
      const response = await axios.get('http://localhost:3000/search');
      const lobbies = response.data; // Assuming the response contains an array of lobby data
      setGameSessions(lobbies); // Update gameSessions state with the fetched lobbies
    } catch (error) {
      console.error('Error fetching lobbies:', error);
    }
  };
  return (
    <div className="app">
      <header className="header">
        <nav>
          <a href="/home">Home</a>
          <a href="/about">About</a>
        </nav>
        <div>user_name</div>
      </header>

      <div className="search-container">
        <input type="text" placeholder="Search" />
        <button>Filter</button>
      </div>

      <div className="game-card-container">
        {gameSessions.map((session) => (
          <div key={session.id} className="game-card">
            <h3>{session.roomTitle}</h3>
            <h3>{session.gameTitle}</h3>
            <p>{session.rank}</p>
            <p>Current Players: {session.currentPlayers}</p>

            <p>Lobby Capacity: {session.maxPlayers} Players</p>
            <button className="joinButton" onClick={() => handleJoin(session.roomTitle)}>Join!</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
