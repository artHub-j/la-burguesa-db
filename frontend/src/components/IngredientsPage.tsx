import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Text,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  IconButton,
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
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, ViewIcon, AddIcon } from "@chakra-ui/icons";

interface Ingredient {
  nom: string;
  preu: number;
}

const IngredientsPage: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIngredientNom, setSelectedIngredientNom] = useState<
    string | null
  >(null);

  const deleteDisclosure = useDisclosure();
  const createDisclosure = useDisclosure();
  const editDisclosure = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [newNom, setNewNom] = useState("");
  const [newPreu, setNewPreu] = useState("");
  const [editPreu, setEditPreu] = useState("");

  const fetchIngredients = (page: number) => {
    setLoading(true);
    axios
      .get(`http://127.0.0.1:8000/ingredients/?page=${page}`)
      .then((response) => {
        setIngredients(response.data.results);
        setTotalPages(response.data.num_pages);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch ingredients");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchIngredients(currentPage);
  }, [currentPage]);

  const deleteIngredient = async (nom: string) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/ingredients/${nom}/delete/`);
      setIngredients(
        ingredients.filter((ingredient) => ingredient.nom !== nom)
      );
    } catch (error: any) {
      console.error(
        "Failed to delete ingredient:",
        error.response || error.message
      );
    }
  };

  const handleDeleteClick = (nom: string) => {
    setSelectedIngredientNom(nom);
    deleteDisclosure.onOpen();
  };

  const confirmDelete = () => {
    if (selectedIngredientNom !== null) {
      deleteIngredient(selectedIngredientNom);
    }
    deleteDisclosure.onClose();
  };

  const handleCreateIngredient = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/ingredients/new/",
        {
          nom: newNom,
          preu: parseFloat(newPreu),
        }
      );
      setIngredients([...ingredients, response.data]);
      createDisclosure.onClose();
      setNewNom("");
      setNewPreu("");
    } catch (error: any) {
      console.error(
        "Failed to create ingredient:",
        error.response || error.message
      );
    }
  };

  const handleEditClick = (ingredient: Ingredient) => {
    setSelectedIngredientNom(ingredient.nom);
    setEditPreu(ingredient.preu.toString());
    editDisclosure.onOpen();
  };

  const handleEditIngredient = async () => {
    if (!selectedIngredientNom) return;

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/ingredients/${selectedIngredientNom}/edit/`,
        {
          preu: parseFloat(editPreu),
        }
      );
      setIngredients(
        ingredients.map((ingredient) =>
          ingredient.nom === selectedIngredientNom ? response.data : ingredient
        )
      );
      editDisclosure.onClose();
      setSelectedIngredientNom(null);
      setEditPreu("");
    } catch (error: any) {
      console.error(
        "Failed to update ingredient:",
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
      <Button
        marginRight="10px"
        colorScheme="yellow"
        aria-label="Create ingredient"
        rightIcon={<AddIcon />}
        onClick={createDisclosure.onOpen}
      >
        Crear Ingredient
      </Button>
      {ingredients.map((ingredient) => (
        <Box
          key={ingredient.nom}
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
            <Text>Nom: {ingredient.nom}</Text>
          </Box>
          <Box flex="2" backgroundColor="white" padding="10px" overflow="auto">
            <Text>
              <b>- Preu: </b>
              {ingredient.preu}
            </Text>
          </Box>
          <Box flex="0" borderTop="1px solid white" padding="10px">
            <Flex justifyContent="flex-end">
              <Spacer />
              <IconButton
                marginRight="10px"
                colorScheme="red"
                aria-label="Delete ingredient"
                icon={<DeleteIcon />}
                onClick={() => handleDeleteClick(ingredient.nom)}
              />
              <IconButton
                marginRight="10px"
                colorScheme="blue"
                aria-label="Edit ingredient"
                icon={<EditIcon />}
                onClick={() => handleEditClick(ingredient)}
              />
              {/* <IconButton
                aria-label="View ingredient details"
                colorScheme="green"
                icon={<ViewIcon />}
                onClick={() => {
                  
                }}
              ></IconButton> */}
            </Flex>
          </Box>
        </Box>
      ))}
      <Flex justifyContent="space-between" width="100%">
        <Button
          onClick={() => setCurrentPage(currentPage - 1)}
          isDisabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          isDisabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Flex>
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
              textAlign="center"
            >
              Esborrar Ingredient
            </AlertDialogHeader>

            <AlertDialogBody>
              Esteu segur que voleu suprimir aquest ingredient? Aquesta acció no
              pot ser desfeta.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={deleteDisclosure.onClose}>
                Cancel.lar
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Esborrar Ingredient
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal
        isOpen={createDisclosure.isOpen}
        onClose={createDisclosure.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear Nou Ingredient</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nom</FormLabel>
              <Input
                placeholder="Nom"
                value={newNom}
                onChange={(e) => setNewNom(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Preu</FormLabel>
              <Input
                placeholder="Preu"
                type="number"
                value={newPreu}
                onChange={(e) => setNewPreu(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateIngredient}>
              Crear
            </Button>
            <Button variant="ghost" onClick={createDisclosure.onClose}>
              Cancel.lar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={editDisclosure.isOpen} onClose={editDisclosure.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Ingredient</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Preu</FormLabel>
              <Input
                placeholder="Preu"
                type="number"
                value={editPreu}
                onChange={(e) => setEditPreu(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleEditIngredient}>
              Guardar
            </Button>
            <Button variant="ghost" onClick={editDisclosure.onClose}>
              Cancel.lar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default IngredientsPage;
