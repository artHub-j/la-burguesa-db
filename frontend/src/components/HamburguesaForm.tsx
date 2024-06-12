import { useState } from "react";
import {
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
} from "@chakra-ui/react";

const HamburguesaForm = ({ onClose }) => {
  const [nom, setNom] = useState("");
  const [preu, setPreu] = useState("");
  const [descripcio, setDescripcio] = useState("");
  const [ingredients, setIngredients] = useState([]);

  const handleSubmit = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/productes/new-hamburguesa/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom,
          preu,
          descripcio,
          ingredients_conte: ingredients,
        }),
      }
    );

    if (response.ok) {
      // Handle successful response
      onClose();
    } else {
      // Handle error
      console.error("Failed to create Hamburguesa");
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
      <FormControl>
        <FormLabel>Ingredients</FormLabel>
        <Input
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value.split(","))}
        />
      </FormControl>
      <Button colorScheme="blue" onClick={handleSubmit}>
        Crear Hamburguesa
      </Button>
    </VStack>
  );
};

export default HamburguesaForm;
