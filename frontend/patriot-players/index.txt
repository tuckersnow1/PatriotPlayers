import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateJoinPage from './patriot-players/src/CreateJoinPage';
import CreatePage from './patriot-players/src/CreatePage';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<CreateJoinPage />} />
        <Route path="/create" element={<CreatePage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);