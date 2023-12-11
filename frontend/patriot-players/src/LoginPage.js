import React, { useState } from 'react';
import styled from 'styled-components';
import './login.css'
import DiscordSignInButton from './discordButton.js';

const SignInContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const SignInForm = styled.form`
  background-color: #ffffff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 8px;
  width: 300px;
`;

const Title = styled.h2`
  color: #333333;
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #333333;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Button = styled.button`
  background-color: #3498db;
  color: #ffffff;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
// Define the Login component
const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }

        // Server API call to check username and password
        const isValidUser = checkUserCredentials(username, password);

        if (isValidUser) {
            // Simulate storing user details in localStorage after successful login
            localStorage.setItem('loggedInUser', JSON.stringify({ username }));

            // Notify the parent component about the successful login
            onLogin();
        } else {
            alert('Invalid username or password');
        }
    };

    // checking user credentials (done on server)
    const checkUserCredentials = (enteredUsername, enteredPassword) => {
        // Retrieve user details from localStorage
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            return (
                enteredUsername === parsedUser.username &&

                enteredPassword === parsedUser.password
            );
        }
        return false;
    };

    return (
        <SignInContainer>
            <Title> Log-In To Patriot Players!</Title>
            <SignInForm onSubmit={handleSubmit}>
                <h2>Login</h2>
                <Label>
                    Username:
                    <Input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Label>
                <Label>
                    Password:
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Label>
                <Button type="submit">Login</Button>
            </SignInForm>

            {/* Include the Discord sign-on button */}
            <DiscordSignInButton />
        </SignInContainer>
    );
};

export default Login;

