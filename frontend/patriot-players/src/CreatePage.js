import React, { useState } from 'react';
import './CreatePage.css';
import axios from 'axios';
import { useLobbyContext } from './LobbyContext';
/**
 * This page allows the user to create and enter a new lobby. It calls the useLobbyContext to obtain the props of gameSessions
 * It also has local variable formData which has a setter.
 * The handleChange changes the formdata based on whatever text is being typed into the text boxes
 * Handle submit makes a request to our backend api endpoint with the form data.
 * @returns the createPage for inserting a new Lobby
 */
function CreatePage() {
  const {updateLobbies} = useLobbyContext();
  const [formData, setFormData] = useState({
    roomTitle: '',
    gameTitle: '',
    body: '',
    genre: '',
    rank: '',
    maxPlayers: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/create-lobby', formData);
      updateLobbies(response.data)
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="create-page">
      <header className="header">
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>
        <div>Tucker</div>
      </header>

      <div className="form-container">
        <form className="create-form" onSubmit={handleSubmit}>
         
          <label htmlFor="roomTitle">Room Title</label>
          <input type="text" id="roomTitle" name="roomTitle" placeholder="Enter room title" onChange={handleChange} />
          
          <label htmlFor="gameTitle">Game Title</label>
          <input type="text" id="gameTitle" name="gameTitle" placeholder="Enter game title" onChange={handleChange} />

          <label htmlFor="body">Body</label>
          <input type="text" id="body" name="body" placeholder="Enter description of lobby" onChange={handleChange} />

          <label htmlFor="genre">Genre</label>
          <input type="text" id="genre" name="genre" placeholder="Enter genre" onChange={handleChange} />

          <label htmlFor="rank">Rank</label>
          <input type="number" id="rank" name="rank" placeholder="Enter rank" onChange={handleChange} />
{/* 
          <label htmlFor="currentPlayers">Current Players</label>
          <input type="number" id="currentPlayers" name="currentPlayers" placeholder="Enter lobby capacity" onChange={handleChange} /> */}

          <label htmlFor="maxPlayers">Maximum Players</label>
          <input type="number" id="maxPlayers" name="maxPlayers" placeholder="Enter lobby capacity" onChange={handleChange} />

          <div className="form-actions">
            <button type="submit" className="create-button">Create!</button>
            <button type="button" className="cancel-button">Cancel...</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePage;
