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
import IngredientsPage from "./components/IngredientsPage"; // Import your ComandesPage component

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
            <Flex gap={4}>
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
              <Link to="/ingredients">
                <Button colorScheme="teal">Ingredients</Button>
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
        ></Text>
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
              <Route path="/ingredients" element={<IngredientsPage />} />
              {/* Add more routes as needed */}
            </Routes>
          </Flex>
        </Flex>
      </Router>
    </ChakraProvider>
  );
};

export default App;
