// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";
// import SampleSidebar from "./components/SampleSidebar";
// import { ChakraProvider } from "@chakra-ui/react";
// import SocialProfileWithImage from "./components/SocialProfileWithImage";

// function App() {
//   // const [count, setCount] = useState(0);

//   return (
//     <ChakraProvider>
//       <SocialProfileWithImage></SocialProfileWithImage>
//     </ChakraProvider>
//   );
// }

// export default App;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const App: React.FC = () => {
//   const [username, setUsername] = useState<string>(""); // State to store the username input
//   const [email, setEmail] = useState<string>("");
//   const [error, setError] = useState<string | null>(null);

//   const handleSearch = async () => {
//     try {
//       const response = await axios.get(
//         `http://127.0.0.1:8000/get-email/${username}/`
//       );
//       console.log("Response data:", response.data); // Log the response data
//       setEmail(response.data.email);
//     } catch (error) {
//       console.error("Error fetching email:", error);
//       setError("Error fetching email");
//     }
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         placeholder="Enter username"
//       />
//       <button onClick={handleSearch}>Search Email</button>
//       <div>{error ? <h1>{error}</h1> : <h1>Email: {email}</h1>}</div>
//     </div>
//   );
// };

// export default App;

// App.tsx
import React from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  Button,
  Image,
  Text,
  Spacer,
} from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ClientList from "./components/ClientList";
import ComandesPage from "./components/ComandesPage"; // Import your ComandesPage component
import ProductesPage from "./components/ProductesPage"; // Import your ComandesPage component

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <Router>
        <Box as="header" className="App-header" width="100vw" p={4}>
          <Flex
            maxWidth="1200px"
            margin="0 auto"
            align="center"
            width="100%"
            height="35px"
          >
            <Image
              src="../public/laburguesalogo.png"
              alt="App Logo"
              boxSize="50px"
            />
            <Spacer />
            <Flex spacing={4}>
              <Link to="/">
                <Button colorScheme="teal">Home</Button>
              </Link>
              <Link to="/clients">
                <Button colorScheme="teal">Clients</Button>
              </Link>
              <Link to="/comandes">
                <Button colorScheme="teal">Comandes</Button>
              </Link>
              <Link to="/productes">
                <Button colorScheme="teal">Productes</Button>
              </Link>
            </Flex>
            <Spacer />
          </Flex>
        </Box>
        <Text
          fontSize="30"
          fontFamily="Roboto, sans-serif"
          fontWeight="bold"
          mb={0}
          bg="black"
          color="white"
          textAlign="center"
        >
          CONSULTAR
        </Text>
        <Flex
          className="App"
          minHeight="100vh"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg="white"
          p={4}
        >
          <Flex
            as="main"
            p={4}
            bg="white"
            flexGrow={1}
            width="100%"
            maxWidth="1200px"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Routes>
              <Route path="/clients" element={<ClientList />} />
              <Route path="/comandes" element={<ComandesPage />} />
              <Route path="/productes" element={<ProductesPage />} />
              {/* Add more routes as needed */}
            </Routes>
          </Flex>
        </Flex>
      </Router>
    </ChakraProvider>
  );
};

export default App;
