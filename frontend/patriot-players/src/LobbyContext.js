import React, { createContext, useState, useContext } from 'react';

/**
 * We are using a Context provider to keep the data state of all the current lobbies
 * available to join. Whatever routes are wrapped within this provider will have access to that data
 * and so the lobbies won't dissapear from the screen
 * The value that we are using the context for is the gameSessions array (the list of joinable lobbies you see on the main page)
 * Whenever a new Lobby is created from the Create Page, the useLobbyContext method will be called
 * which will return a new UseContext.
 * A useContext is used to automatically share down the data from the parent components to the child components
 */
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