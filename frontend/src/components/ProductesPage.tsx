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

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/productes/") // Assuming this is the correct endpoint for fetching products
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch products");
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
              <Text>
                <b>- Descripció: </b>
                {product.detalls.descripcio}
              </Text>
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
    </VStack>
  );
};

export default ProductList;
