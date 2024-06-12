import React, { useState } from "react";
import {
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
} from "@chakra-ui/react";

const BegudaForm = ({ onClose }) => {
  const [nom, setNom] = useState("");
  const [preu, setPreu] = useState("");

  const handleSubmit = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/productes/new-beguda/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nom, preu }),
      }
    );

    if (response.ok) {
      // Handle successful response
      onClose();
    } else {
      // Handle error
      console.error("Failed to create Acompanyament");
    }
  };

  return (
    <VStack spacing={4}>
      <FormControl>
        <FormLabel>Nom</FormLabel>
        <Input value={nom} onChange={(e) => setNom(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Preu</FormLabel>
        <Input value={preu} onChange={(e) => setPreu(e.target.value)} />
      </FormControl>

      <Button colorScheme="blue" onClick={handleSubmit}>
        Crear Beguda
      </Button>
      <Button colorScheme="red" onClick={onClose}>
        Cancel
      </Button>
    </VStack>
  );
};

export default BegudaForm;