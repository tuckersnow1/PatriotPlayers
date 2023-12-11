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





///: We were trying to add something here but that wasnt fully working so we commented it out for now.
// // import React from 'react';
// // import ReactDOM from 'react-dom';
// // import './index.css';
// // import App from './App';
// // import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// // import CreateJoinPage from './CreateJoinPage.js';
// // import CreatePage from './CreatePage.js';
// // import { LobbyProvider } from './LobbyContext.js';
// // import LoginPage from "./LoginPage";

// // ReactDOM.render(
// //   <React.StrictMode>
// //     <Router>
// //       <LobbyProvider>
// //       <Routes>
// //         <Route path="/" element={<App />} />
// //         <Route path="/home" element={<LoginPage />} />
// //           <Route path="/login" element={<CreateJoinPage />} />
// //         <Route path="/create" element={<CreatePage />} />
// //         {/* Add more routes as needed */}
// //       </Routes>
// //       </LobbyProvider>
// //     </Router>
// //   </React.StrictMode>,
// //   document.getElementById('root')
// // );


// /**
//  * Login->App.js->Home(CreateJoinPage)->
//  */




// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import CreateJoinPage from './CreateJoinPage.js';
// import CreatePage from './CreatePage.js';
// import { LobbyProvider } from './LobbyContext.js';
// import LoginPage from './LoginPage.js';
// import {UserProvider} from './UserContext.js'

// ReactDOM.render(
//   <React.StrictMode>
//          {/* <LoginPage></LoginPage> */}
//     <Router>
//     <Routes>

//       <Route path="/login" element={<LoginPage />} />
//       {/* <LobbyProvider> */}

//       <Route path="/app" element={<App />} />
//       {/* </LobbyProvider> */}
//       <Route path="/home" element={<CreateJoinPage />} />
//       <Route path="/create" element={<CreatePage />} />

//             </Routes>
//         {/* <LobbyProvider>
//           <Routes>
//             <Route path="/app" element={<App />} />
//             <Route path="/home" element={<CreateJoinPage />} />
//             <Route path="/create" element={<CreatePage />} />
//           </Routes>
//         </LobbyProvider> */}
//     </Router>
//   </React.StrictMode>,
//   document.getElementById('root')
// );