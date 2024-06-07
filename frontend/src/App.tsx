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
  IconButton,
  Image,
  HStack,
  Text,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import ClientList from "./components/ClientList";

import { HamburgerIcon } from "@chakra-ui/icons";

const App: React.FC = () => {
  return (
    <ChakraProvider>
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
          <HStack spacing={4} justifyContent="center">
            {" "}
            {/* Center the buttons */}
            <Button colorScheme="teal">Home</Button>
            <Button colorScheme="teal">Clients</Button>
            <Button colorScheme="teal">Comandes</Button>
            <Button colorScheme="teal">Comandes</Button>
          </HStack>
          <Spacer />
          {/* User profile image button */}
          <Flex flex="1" justifyContent="flex-end">
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="User profile"
                icon={<HamburgerIcon />}
                // variant="ghost"
              />
              <MenuList>
                <MenuItem>Profile</MenuItem>
                <MenuItem>Settings</MenuItem>
                <MenuItem>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
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
        CONSULTAR CLIENTS
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
          <ClientList />
        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default App;
