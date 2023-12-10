import React from 'react';
import './index.css';

function App() {
  // Dummy data for game sessions
  const gameSessions = [
    { id: 1, roomTitle: "Let's play Rainbow Six Siege", gameTitle: "Rainbow Six Siege", rank: "Prestige", maxPlayers: 15 },
    { id: 2, roomTitle: "Let's play Call of Duty", gameTitle: "Call of Duty", rank:"Amateur", maxPlayers: 25 },
    // ... add more game sessions as needed
  ];

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
            <p>{session.maxPlayers} Players</p>
            <button className="joinButton">Join!</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
