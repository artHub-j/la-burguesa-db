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
  Button,
  HStack,
  Center,
  Flex,
  Spacer,
} from "@chakra-ui/react";

interface Client {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  num_telefon: string;
  adreca: string;
  data_naix: string;
}

import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/clients/")
      .then((response) => {
        setClients(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch clients");
        setLoading(false);
      });
  }, []);

  const deleteClient = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/delete-client/${id}/`);
      setClients(clients.filter((client) => client.id !== id));
    } catch (error: any) {
      console.error(
        "Failed to delete client:",
        error.response || error.message
      );
    }
  };

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
      {clients.map((client) => (
        <Box
          key={client.id}
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
            <Text>ID {client.id}</Text>
          </Box>
          <Box flex="2" backgroundColor="white" padding="10px" overflow="auto">
            <Text>
              <Text>
                <b>- Username: </b>
                {client.username}
              </Text>
              <b>- Nom: </b>
              {client.first_name} {client.last_name}
            </Text>
            <Text>
              <b>- Email: </b>
              {client.email}
            </Text>
            <Text>
              <b>- Telèfon: </b>
              {client.num_telefon}
            </Text>
            <Text>
              <b>- Adreça: </b>
              {client.adreca}
            </Text>
            <Text>
              <b>- Data Naixement: </b>
              {client.data_naix}
            </Text>
          </Box>
          <Box
            flex="0"
            // backgroundColor="#f0f0f0"
            borderTop="1px solid white"
            padding="10px"
          >
            <Flex justifyContent="flex-end">
              {" "}
              {/* Aligns content to the right */}
              {/* Use Spacer component to push buttons to the right */}
              <Spacer />
              <IconButton
                marginRight="10px"
                colorScheme="red"
                aria-label="Delete client"
                icon={<DeleteIcon />}
                onClick={() => deleteClient(client.id)}
              />
              <IconButton
                marginRight="10px"
                colorScheme="blue"
                aria-label="Edit client"
                icon={<EditIcon />}
                onClick={() => {
                  /* Your edit client logic here */
                }}
              />
              <Button
                colorScheme="green"
                onClick={() => {
                  /* Your edit client logic here */
                }}
              >
                Veure Comandes
              </Button>
            </Flex>
          </Box>
        </Box>
      ))}
    </VStack>
  );
};

export default ClientList;
