import React, { createContext, useState, useContext } from 'react';

// Create a new context for user data
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUserContext = () => {
  return useContext(UserContext);
};

// UserProvider component to manage user-related state
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState("apple");

  // Function to update user data
  const updateUser = (newUserData) => {
    setUserData(newUserData);
    // You might want to save the updated user data in localStorage or make API calls
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
