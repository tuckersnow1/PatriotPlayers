// import React from 'react';
// import styled from 'styled-components';

// // Styled component for the Discord button
// const DiscordButton = styled.a`
//   display: inline-block;
//   background-color: #7289da; /* Discord brand color */
//   color: #fff;
//   padding: 10px 20px;
//   border-radius: 5px;
//   text-decoration: none;
//   font-weight: bold;
//   cursor: pointer;
//   transition: background-color 0.3s ease;

//   &:hover {
//     background-color: #677bc4; /* Slightly darker on hover */
//   }
// `;

// const express=require('express');
// const axios=require('axios');
// const PORT=8000;
// const app= express();
// app.listen(PORT, ()=>{
//     console.log(`App started on port ${PORT}`);
// })
// // Discord OAuth2 URL for authentication
// const discordOAuthUrl = 'https://discord.com/api/oauth2/authorize?client_id=1154142275711021217&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fuser&scope=identify';

// // Define the DiscordSignInButton component
// const DiscordSignInButton = () => {
//     const handleDiscordSignIn = () => {
//         // Redirect the user to the Discord OAuth2 URL when the button is clicked
//         window.location.href = discordOAuthUrl;
//     };

//     // Handle the callback after the user returns from Discord authorization
//     const handleDiscordCallback = async () => {
//         app.get('/auth/discord',async (req,res)=>{
//             // Parse the query parameters from the URL to get the authorization code
//             const queryParams = new URLSearchParams(window.location.search);
//             const authorizationCode = queryParams.get('code');
            
//         })


//         if (authorizationCode) {
//             try {
//                 // Exchange the authorization code for an access token
//                 const response = await axios.post('https://discord.com/api/oauth2/token', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/x-www-form-urlencoded',
//                     },
//                     body: new URLSearchParams({
//                         client_id: process.env.CLIENT_ID,
//                         client_secret: process.env.CLIENT_SECRET,
//                         code: authorizationCode,
//                         grant_type: 'authorization_code',
//                         redirect_uri: window.location.origin,
//                     }),
//                 });

//                 if (response.ok) {
//                     const data = await axios.get('https://discord.com/api/users/@me');
//                     const accessToken = data.access_token;
//                     console.log('Access Token:', accessToken);
//                     // use access token to make requests to the Discord API
//                 } else {
//                     console.error('Failed to exchange authorization code for access token');
//                 }
//             } catch (error) {
//                 console.error('Error exchanging authorization code for access token:', error);
//             }
//         }
//     };

//     // Check if the URL contains the authorization code after the user returns
//     React.useEffect(() => {
//         handleDiscordCallback();
//     }, []);




//     return (
//         <DiscordButton onClick={handleDiscordSignIn}>
//             Sign in with Discord
//         </DiscordButton>
//     );
// };

// export default DiscordSignInButton;
