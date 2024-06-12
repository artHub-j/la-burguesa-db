import React, { useState } from "react";
import {
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
} from "@chakra-ui/react";

const AcompanyamentForm = ({ onClose }) => {
  const [nom, setNom] = useState("");
  const [preu, setPreu] = useState("");
  const [descripcio, setDescripcio] = useState("");

  const handleSubmit = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/productes/new-postre/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nom, preu, descripcio }),
      }
    );

    if (response.ok) {
      // Handle successful response
      onClose();
    } else {
      // Handle error
      console.error("Failed to create Postre");
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
      <FormControl>
        <FormLabel>Descripcio</FormLabel>
        <Input
          value={descripcio}
          onChange={(e) => setDescripcio(e.target.value)}
        />
      </FormControl>
      <Button colorScheme="blue" onClick={handleSubmit}>
        Crear Postre
      </Button>
      <Button colorScheme="red" onClick={onClose}>
        Cancel
      </Button>
    </VStack>
  );
};

export default AcompanyamentForm;
