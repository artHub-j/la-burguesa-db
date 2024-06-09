import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Text,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  IconButton,
  Spacer,
  Flex,
} from "@chakra-ui/react";

import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";

interface Comanda {
  id: number;
  data: string;
  hora_creacio: string;
  preu_total: Float32Array;
  dni_processada: string;
  username_client: string;
  // Add more comandes properties as needed
}

const ComandesPage: React.FC = () => {
  const [comandes, setComandes] = useState<Comanda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/comandes/") // Assuming this is the correct endpoint for fetching comandes
      .then((response) => {
        setComandes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch comandas");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <VStack spacing={4}>
      {comandes.map((comanda) => (
        <Box
          key={comanda.id}
          shadow="md"
          borderWidth="1px"
          width="100%"
          borderRadius="md"
          bg="white"
          display="flex"
          flexDirection="column"
          height="auto"
          border="1px solid #ccc"
        >
          <Box
            flex="0"
            backgroundColor="#f0f0f0"
            borderBottom="1px solid #ccc"
            padding="10px"
          >
            <Text>ID {comanda.id}</Text>
          </Box>
          <Box flex="2" backgroundColor="white" padding="10px" overflow="auto">
            <Text>
              <b>- Data: </b>
              {comanda.data}
            </Text>
            <Text>
              <b>- Hora Creació: </b>
              {comanda.hora_creacio}
            </Text>
            <Text>
              <b>- Preu Total: </b>
              {comanda.preu_total}
            </Text>
            <Text>
              <b>- DNI Empleat Processada: </b>
              {comanda.dni_processada}
            </Text>
            <Text>
              <b>- Client: </b>
              {comanda.username_client}
            </Text>
            {/* Add more comanda details as needed */}
          </Box>
          <Box flex="0" borderTop="1px solid white" padding="10px">
            <Flex justifyContent="flex-end">
              <Spacer />
              <IconButton
                marginRight="10px"
                colorScheme="red"
                aria-label="Delete comanda"
                icon={<DeleteIcon />}
              />
              <IconButton
                marginRight="10px"
                colorScheme="blue"
                aria-label="Edit comanda"
                icon={<EditIcon />}
              />
              <IconButton
                aria-label="View comanda details"
                colorScheme="green"
                icon={<ViewIcon />}
                onClick={() => {
                  /* Your view comanda logic here */
                }}
              ></IconButton>
            </Flex>
          </Box>
        </Box>
      ))}
    </VStack>
  );
};

export default ComandesPage;
