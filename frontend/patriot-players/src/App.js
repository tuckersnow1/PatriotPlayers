import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import axios from 'axios';
import './index.css';

function App() {
  // Dummy data for game sessions
  const [searchQuery, setSearchQuery] = useState('');
  const [gameSessions, setGameSessions] = useState(
    [{ id: 1, roomTitle: "Let's play Rainbow Six Siege", gameTitle: "Rainbow Six Siege", body:"Mason Students playing Rainbow Six", genre: "Adventure",rank: "Prestige",currentPlayers: 5, maxPlayers: 15 },
    { id: 2, roomTitle: "Let's play Call of Duty", gameTitle: "Call of Duty", body:"Mason Students playing COD", genre:"RPG", rank:"Amateur", currentPlayers: 10, maxPlayers: 25 },]
    // ... add more game sessions as needed
  );
  /**
   * This method is used to fetch current lobbies when the component mounts (or is initialized)
   */
  useEffect(() => {
    fetchLobbies();
  }, []);
  /*
  This method handles sending the input query what was typed into the search bar to the search api endpoint.
  updates the gameSessions global variable using setter.
  */
  const handleSearch = async(searchQuery) => {
    try {
      console.log("Entered Search function")
      const response = await axios.get('http://localhost:3000/search', {gameTitle: searchQuery});
      const lobbies = response.data;
      console.log(lobbies)
      setGameSessions(lobbies);
    } catch (error) {
      console.error("Error finding lobby: ", error);
    }
  }
  /*
  This method passes the search query to the handle search function for the search button
  */
  const handleButtonClick = async (e) => {
    e.preventDefault();
    console.log("Entered this function")
    const curr = searchQuery;
    handleSearch(curr);
  };
  /**
   * This method handles the event when a lobby is joined. 
   * It takes in the lobbyname of the lobby on the UI that the user clicked.
   * Then it makes a call to the increasePlayers endpoint on our backend to update the number of current players
   * for that game in our MongoDB.
   * @param {*} lobbyName 
   */
  const handleJoin = async (lobbyName) => {
    try {
      await axios.put('http://localhost:3000/increasePlayers', { lobbyName });
      fetchLobbies(); 
    } catch (error) {
      console.error('Error joining lobby:', error);
    }
  };
  const fetchLobbies = async () => {
    try {
      // Make a GET request to fetch lobbies
      const response = await axios.get('http://localhost:3000/search');
      const lobbies = response.data; 
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
        <div>Tucker</div>
      </header>
      <div className="search-container">
        <input
          id="searchInput"
          type="text"
          placeholder="Search for GameName"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleButtonClick}>Search</button>
      </div>
     
      <div className="game-card-container">
        {gameSessions.map((session) => (
          <div key={session.id} className="game-card">
            <h3>Room: {session.roomTitle}</h3>
            <h3>Game: {session.gameTitle}</h3>
            <p>Rank: {session.rank}</p>
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