import React, { createContext, useState, useContext } from 'react';

const LobbyContext = createContext();

export const useLobbyContext = () => {
  return useContext(LobbyContext);
};

export const LobbyProvider = ({ children }) => {
  const [gameSessions, setGameSessions] = useState([]);

  const updateLobbies = (newLobby) => {
    setGameSessions((prevLobbies) => [...prevLobbies, newLobby]);
  };

  return (
    <LobbyContext.Provider value={{ gameSessions, updateLobbies }}>
      {children}
    </LobbyContext.Provider>
  );
};