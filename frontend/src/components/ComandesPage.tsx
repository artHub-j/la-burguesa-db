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
  Flex,
  Spacer,
  Collapse,
} from "@chakra-ui/react";

interface Comanda {
  id: number;
  data: string;
  hora_creacio: string;
  preu_total: number;
  dni_processada: string;
  username_client: string;
}

interface Item {
  producte_id: number;
  producte_nom: string;
  quantitat_prod: number;
  preu_pagat_producte: number;
}

const ComandesPage: React.FC = () => {
  const [comandes, setComandes] = useState<Comanda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [details, setDetails] = useState<{ [key: number]: Item[] | null }>({});
  const [loadingDetails, setLoadingDetails] = useState<{
    [key: number]: boolean;
  }>({});

  const fetchComandes = (page: number) => {
    setLoading(true);
    axios
      .get(`http://127.0.0.1:8000/comandes/?page=${page}`)
      .then((response) => {
        setComandes(response.data.results);
        setTotalPages(response.data.num_pages);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch comandas");
        setLoading(false);
      });
  };

  const fetchDetails = (comandaId: number) => {
    setLoadingDetails((prev) => ({ ...prev, [comandaId]: true }));
    axios
      .get(`http://127.0.0.1:8000/comandes/${comandaId}/`)
      .then((response) => {
        setDetails((prev) => ({ ...prev, [comandaId]: response.data.items }));
        setLoadingDetails((prev) => ({ ...prev, [comandaId]: false }));
      })
      .catch((error) => {
        setError("Failed to fetch details");
        setLoadingDetails((prev) => ({ ...prev, [comandaId]: false }));
      });
  };

  useEffect(() => {
    fetchComandes(currentPage);
  }, [currentPage]);

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
            display="flex"
            justifyContent="space-between"
          >
            <Text>ID {comanda.id}</Text>
            <Button
              bg="teal"
              onClick={() => {
                if (!details[comanda.id]) {
                  fetchDetails(comanda.id);
                }
                setDetails((prev) => ({
                  ...prev,
                  [comanda.id]: details[comanda.id] ? null : [],
                }));
              }}
            >
              {details[comanda.id] ? "Hide Details" : "Show Details"}
            </Button>
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
          </Box>
          <Collapse in={!!details[comanda.id]}>
            <Box
              flex="2"
              backgroundColor="white"
              padding="10px"
              overflow="auto"
            >
              {loadingDetails[comanda.id] ? (
                <Spinner />
              ) : (
                details[comanda.id] &&
                details[comanda.id].map((item) => (
                  <Box
                    key={item.producte_id}
                    padding="5px"
                    border="1px solid #eee"
                    borderRadius="md"
                  >
                    <Text>
                      <b>Producte ID:</b> {item.producte_id}
                    </Text>
                    <Text>
                      <b>Producte Nom:</b> {item.producte_nom}
                    </Text>
                    <Text>
                      <b>Quantitat:</b> {item.quantitat_prod}
                    </Text>
                    <Text>
                      <b>Preu Pagat:</b> {item.preu_pagat_producte}
                    </Text>
                  </Box>
                ))
              )}
            </Box>
          </Collapse>
          <Box flex="0" borderTop="1px solid white" padding="10px">
            <Flex justifyContent="flex-end">
              <Spacer />
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
    </VStack>
  );
};

export default ComandesPage;
