import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  useToast,
} from "@chakra-ui/react";
import Select from "react-select";

const HamburguesaForm = ({ onClose }) => {
  const [nom, setNom] = useState("");
  const [preu, setPreu] = useState("");
  const [descripcio, setDescripcio] = useState("");
  const [ingredientsConte, setIngredientsConte] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/ingredients/?page=1")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.results)) {
          setIngredients(data.results);
        } else {
          throw new Error("Invalid ingredients data");
        }
      })
      .catch((error) => {
        console.error("Error fetching ingredients:", error);
        toast({
          title: "Error fetching ingredients",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  }, [toast]);

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
          ingredients_conte: ingredientsConte,
        }),
      }
    );

    if (response.ok) {
      // Handle successful response
      toast({
        title: "Success",
        description: "Hamburguesa created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } else {
      // Handle error
      console.error("Failed to create Hamburguesa");
      toast({
        title: "Error",
        description: "Failed to create Hamburguesa.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
        <Input
          type="number"
          value={preu}
          onChange={(e) => setPreu(e.target.value)}
        />
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
        <Select
          isMulti
          value={ingredientsConte.map((nom) => ({
            value: nom,
            label:
              ingredients.find((ingredient) => ingredient.nom === nom)?.nom ||
              "Unknown",
          }))}
          onChange={(selectedOptions) => {
            setIngredientsConte(selectedOptions.map((option) => option.value));
          }}
          options={ingredients.map((ingredient) => ({
            value: ingredient.nom,
            label: ingredient.nom,
          }))}
        />
      </FormControl>
      <Button colorScheme="blue" onClick={handleSubmit}>
        Crear Hamburguesa
      </Button>
      <Button colorScheme="red" onClick={onClose}>
        Cancel
      </Button>
    </VStack>
  );
};

export default HamburguesaForm;
