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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
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

import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const deleteDisclosure = useDisclosure();
  const editDisclosure = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const cancelRef = React.useRef();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/clients/?page=${currentPage}`)
      .then((response) => {
        setClients(response.data);
        setTotalPages(response.data.total_pages);
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

  const handleDeleteClick = (id: number) => {
    setSelectedClientId(id);
    deleteDisclosure.onOpen();
  };

  const confirmDelete = () => {
    if (selectedClientId !== null) {
      deleteClient(selectedClientId);
    }
    deleteDisclosure.onClose();
  };

  const handleEditClick = (client: Client) => {
    setSelectedClient(client);
    editDisclosure.onOpen();
  };

  const handleSave = async () => {
    if (selectedClient) {
      try {
        await axios.post(
          `http://127.0.0.1:8000/clients/${selectedClient.id}/edit/`,
          selectedClient
        );
        setClients(
          clients.map((client) =>
            client.id === selectedClient.id ? selectedClient : client
          )
        );
        editDisclosure.onClose();
      } catch (error: any) {
        console.error(
          "Failed to update client:",
          error.response || error.message
        );
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (selectedClient) {
      if (name === "username") {
        // Ensure username is not null or empty
        if (value.trim() !== "") {
          setSelectedClient({ ...selectedClient, [name]: value });
        }
      } else {
        setSelectedClient({ ...selectedClient, [name]: value });
      }
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
                onClick={() => handleDeleteClick(client.id)}
              />
              {/* <IconButton
                marginRight="10px"
                colorScheme="blue"
                aria-label="Edit client"
                icon={<EditIcon />}
                onClick={() => handleEditClick(client)}
              /> */}
            </Flex>
          </Box>
        </Box>
      ))}

      <Modal isOpen={editDisclosure.isOpen} onClose={editDisclosure.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Client</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedClient && (
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Username</FormLabel>
                  <Input
                    name="username"
                    value={selectedClient.username}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    name="first_name"
                    value={selectedClient.first_name}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    name="last_name"
                    value={selectedClient.last_name}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    value={selectedClient.email}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    name="num_telefon"
                    value={selectedClient.num_telefon}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Address</FormLabel>
                  <Input
                    name="adreca"
                    value={selectedClient.adreca}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Birth Date</FormLabel>
                  <Input
                    name="data_naix"
                    value={selectedClient.data_naix}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={editDisclosure.onClose}>Cancel</Button>
            <Button colorScheme="blue" onClick={handleSave} ml={3}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={deleteDisclosure.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={deleteDisclosure.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="normal"
              backgroundColor="#f0f0f0"
              borderBottom="1px solid #ccc"
              color="black"
              align="center"
            >
              Esborrar Client
            </AlertDialogHeader>

            <AlertDialogBody>
              Esteu segur que voleu suprimir aquest client? Aquesta acció no pot
              ser desfeta.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={deleteDisclosure.onClose}>
                Cancel.lar
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Esborrar Client
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Flex justifyContent="space-between" width="100%">
        <Button
          onClick={() =>
            setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
          }
          isDisabled={currentPage === 1}
        >
          Previous
        </Button>
        <Text>
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          onClick={() =>
            setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
          }
          isDisabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Flex>
    </VStack>
  );
};

export default ClientList;
