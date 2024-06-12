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
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, ViewIcon, AddIcon } from "@chakra-ui/icons";

import HamburguesaForm from "./HamburguesaForm";
import AcompanyamentForm from "./AcompanyamentForm";
import BegudaForm from "./BegudaForm";
import PostreForm from "./PostreForm";
import MenuForm from "./MenuForm";

interface Product {
  id: number;
  nom: string;
  preu: number;
  tipus: string;
  detalls: any; // Adjust this type according to your product details
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTipus, setSelectedTipus] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const deleteDisclosure = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const fetchProducts = (page: number, tipus: string) => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/productes/", {
        params: { page, type: tipus },
      })
      .then((response) => {
        setProducts(response.data.results);
        setTotalPages(response.data.num_pages);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch products");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts(currentPage, selectedTipus);
  }, [currentPage, selectedTipus]);

  const handleTipusChange = (tipus: string) => {
    setSelectedTipus(tipus);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const deleteProduct = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/productes/${id}/delete/`);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error: any) {
      console.error(
        "Failed to delete product:",
        error.response || error.message
      );
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedProductId(id);
    deleteDisclosure.onOpen();
  };

  const confirmDelete = () => {
    if (selectedProductId !== null) {
      deleteProduct(selectedProductId);
    }
    deleteDisclosure.onClose();
  };

  const [showOptions, setShowOptions] = useState(false);
  const [productType, setProductType] = useState("");

  const handleCreateClick = () => {
    setShowOptions(true);
  };

  const openCreateForm = (type: string) => {
    setProductType(type);
    setShowOptions(false);
  };

  const closeForm = () => {
    setProductType("");
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
        aria-label="Create product"
        rightIcon={<AddIcon />}
        onClick={handleCreateClick}
      >
        Crear Producte
      </Button>
      {showOptions && (
        <VStack spacing={4}>
          <Button
            colorScheme="blue"
            onClick={() => openCreateForm("hamburguesa")}
          >
            Hamburguesa
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => openCreateForm("acompanyament")}
          >
            Acompanyament
          </Button>
          <Button colorScheme="blue" onClick={() => openCreateForm("beguda")}>
            Beguda
          </Button>
          <Button colorScheme="blue" onClick={() => openCreateForm("postre")}>
            Postre
          </Button>
          <Button colorScheme="blue" onClick={() => openCreateForm("menu")}>
            Menu
          </Button>
        </VStack>
      )}
      {productType === "hamburguesa" && <HamburguesaForm onClose={closeForm} />}
      {productType === "acompanyament" && (
        <AcompanyamentForm onClose={closeForm} />
      )}
      {productType === "beguda" && <BegudaForm onClose={closeForm} />}
      {productType === "postre" && <PostreForm onClose={closeForm} />}
      {productType === "menu" && <MenuForm onClose={closeForm} />}

      <Flex width="100%" justifyContent="space-between" alignItems="center">
        <Button
          onClick={() => handleTipusChange("")}
          isActive={selectedTipus === ""}
        >
          All
        </Button>
        <Button
          onClick={() => handleTipusChange("Hamburguesa")}
          isActive={selectedTipus === "Hamburguesa"}
        >
          Hamburguesa
        </Button>
        <Button
          onClick={() => handleTipusChange("Acompanyament")}
          isActive={selectedTipus === "Acompanyament"}
        >
          Acompanyament
        </Button>
        <Button
          onClick={() => handleTipusChange("Beguda")}
          isActive={selectedTipus === "Beguda"}
        >
          Beguda
        </Button>
        <Button
          onClick={() => handleTipusChange("Postre")}
          isActive={selectedTipus === "Postre"}
        >
          Postre
        </Button>
        <Button
          onClick={() => handleTipusChange("Menu")}
          isActive={selectedTipus === "Menu"}
        >
          Menu
        </Button>
      </Flex>
      {products.map((product) => (
        <Box
          key={product.id}
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
            <Text>ID {product.id}</Text>
          </Box>
          <Box flex="2" backgroundColor="white" padding="10px" overflow="auto">
            <Text>
              <b>- Nom: </b>
              {product.nom}
            </Text>
            <Text>
              <b>- Preu: </b>
              {product.preu}
            </Text>
            <Text>
              <b>- Tipus: </b>
              {product.tipus}
            </Text>
            {/* Render additional details based on product type */}
            {product.tipus === "Hamburguesa" && (
              <>
                <Text>
                  <b>- Descripció: </b>
                  {product.detalls.descripcio}
                </Text>
                <Text>
                  <b>- Ingredients: </b>
                </Text>
                <ul>
                  {product.detalls.ingredients.map(
                    (ingredient: any, index: number) => (
                      <li key={index}>
                        {ingredient.nom}
                        {/* - {ingredient.preu} */}
                      </li>
                    )
                  )}
                </ul>
              </>
            )}
            {product.tipus === "Acompanyament" && (
              <Text>
                <b>- Descripció: </b>
                {product.detalls.descripcio}
              </Text>
            )}
            {product.tipus === "Postre" && (
              <Text>
                <b>- Descripció: </b>
                {product.detalls.descripcio}
              </Text>
            )}
            {product.tipus === "Menu" && (
              <div>
                <Text>
                  <b>- Suma preus: </b>
                  {product.detalls.suma_preus}
                </Text>
                <Box
                  shadow="md"
                  borderWidth="1px"
                  width="100%"
                  borderRadius="md"
                  bg="gray.100"
                  display="flex"
                  flexDirection="column"
                  height="auto"
                  border="1px solid #ccc"
                >
                  <Text>
                    <b>- Hamburguesa: </b>
                    {product.detalls.hamburguesa}
                  </Text>
                  <Text>
                    <b>- Acompanyament: </b>
                    {product.detalls.acompanyament}
                  </Text>
                  <Text>
                    <b>- Beguda: </b>
                    {product.detalls.beguda}
                  </Text>
                  <Text>
                    <b>- Postre: </b>
                    {product.detalls.postre}
                  </Text>
                </Box>
              </div>
            )}
            {/* Add more conditionals for other product types */}
          </Box>
          <Box flex="0" borderTop="1px solid white" padding="10px">
            <Flex justifyContent="flex-end">
              <Spacer />
              <IconButton
                marginRight="10px"
                colorScheme="red"
                aria-label="Delete product"
                icon={<DeleteIcon />}
                onClick={() => handleDeleteClick(product.id)}
              />
              <IconButton
                marginRight="10px"
                colorScheme="blue"
                aria-label="Edit product"
                icon={<EditIcon />}
              />
              <IconButton
                aria-label="View product details"
                colorScheme="green"
                icon={<ViewIcon />}
                onClick={() => {
                  /* Your view product logic here */
                }}
              ></IconButton>
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
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Esborrar Producte
            </AlertDialogHeader>
            <AlertDialogBody>
              Esteu segur que voleu suprimir aquest producte? Aquesta acció no
              pot ser desfeta.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={deleteDisclosure.onClose}>
                Cancel.lar
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Esborrar Producte
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
};

export default ProductList;
