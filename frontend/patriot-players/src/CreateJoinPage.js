import React from 'react';
import './CreateJoinPage.css';
import { Link } from 'react-router-dom';

function CreateJoinPage() {
  return (
    <div className="create-join-page">
      <header className="header">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      
      <h1 className="title">PatriotPlayers</h1>
      
      <div className="buttons-container">
        <Link to="/create" className="create-button">CREATE</Link>
        <Link to="/" className="join-button">JOIN</Link>
      </div>
    </div>
  );
}

export default CreateJoinPage;
