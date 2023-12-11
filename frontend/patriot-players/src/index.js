import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateJoinPage from './CreateJoinPage.js';
import CreatePage from './CreatePage.js';
import { LobbyProvider } from './LobbyContext.js';
import LoginPage from './LoginPage.js';
import {UserProvider} from './UserContext.js'

ReactDOM.render(
  <React.StrictMode>
    <Router>
        <LobbyProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/home" element={<CreateJoinPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </LobbyProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);