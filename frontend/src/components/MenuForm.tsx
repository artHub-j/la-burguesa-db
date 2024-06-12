import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

interface Product {
  producte_id: number;
  producte__nom: string;
}

interface Hamburguesa extends Product {}
interface Acompanyament extends Product {}
interface Beguda extends Product {}
interface Postre extends Product {}

const MenuForm = ({ onClose }) => {
  const [nom, setNom] = useState("");
  const [preu, setPreu] = useState("");
  const [hamburgueses, setHamburgueses] = useState<Hamburguesa[]>([]);
  const [selectedHamburguesa, setSelectedHamburguesa] = useState<Product>({
    producte_id: 0,
    producte__nom: "Select Hamburguesa",
  });
  const [acompanyaments, setAcompanyaments] = useState<Acompanyament[]>([]);
  const [selectedAcompanyament, setSelectedAcompanyament] = useState<Product>({
    producte_id: 0,
    producte__nom: "Select Acompanyament",
  });
  const [begudes, setBegudes] = useState<Beguda[]>([]);
  const [selectedBeguda, setSelectedBeguda] = useState<Product>({
    producte_id: 0,
    producte__nom: "Select Beguda",
  });
  const [postres, setPostres] = useState<Postre[]>([]);
  const [selectedPostre, setSelectedPostre] = useState<Product>({
    producte_id: 0,
    producte__nom: "Select Postre",
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/productes/hamburgueses/")
      .then((response) => response.json())
      .then((data) => setHamburgueses(data));
    fetch("http://127.0.0.1:8000/productes/acompanyaments/")
      .then((response) => response.json())
      .then((data) => setAcompanyaments(data));
    fetch("http://127.0.0.1:8000/productes/begudes/")
      .then((response) => response.json())
      .then((data) => setBegudes(data));
    fetch("http://127.0.0.1:8000/productes/postres/")
      .then((response) => response.json())
      .then((data) => setPostres(data));
  }, []);

  const handleSubmit = async () => {
    const response = await fetch("http://127.0.0.1:8000/productes/new-menu/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nom,
        preu: parseFloat(preu),
        hamburguesa: selectedHamburguesa.producte_id,
        acompanyament: selectedAcompanyament.producte_id,
        beguda: selectedBeguda.producte_id,
        postre: selectedPostre.producte_id,
      }),
    });

    if (response.ok) {
      onClose();
    } else {
      console.error("Failed to create menu");
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
        <FormLabel>Hamburguesa</FormLabel>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {selectedHamburguesa.producte__nom}
          </MenuButton>
          <MenuList>
            {hamburgueses.map((hamburguesa) => (
              <MenuItem
                key={hamburguesa.producte_id}
                onClick={() =>
                  setSelectedHamburguesa({
                    producte_id: hamburguesa.producte_id,
                    producte__nom: hamburguesa.producte__nom,
                  })
                }
              >
                {hamburguesa.producte__nom}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </FormControl>
      <FormControl>
        <FormLabel>Acompanyament</FormLabel>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {selectedAcompanyament.producte__nom}
          </MenuButton>
          <MenuList>
            {acompanyaments.map((acompanyament) => (
              <MenuItem
                key={acompanyament.producte_id}
                onClick={() =>
                  setSelectedAcompanyament({
                    producte_id: acompanyament.producte_id,
                    producte__nom: acompanyament.producte__nom,
                  })
                }
              >
                {acompanyament.producte__nom}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </FormControl>
      <FormControl>
        <FormLabel>Beguda</FormLabel>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {selectedBeguda.producte__nom}
          </MenuButton>
          <MenuList>
            {begudes.map((beguda) => (
              <MenuItem
                key={beguda.producte_id}
                onClick={() =>
                  setSelectedBeguda({
                    producte_id: beguda.producte_id,
                    producte__nom: beguda.producte__nom,
                  })
                }
              >
                {beguda.producte__nom}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </FormControl>
      <FormControl>
        <FormLabel>Postre</FormLabel>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {selectedPostre.producte__nom}
          </MenuButton>
          <MenuList>
            {postres.map((postre) => (
              <MenuItem
                key={postre.producte_id}
                onClick={() =>
                  setSelectedPostre({
                    producte_id: postre.producte_id,
                    producte__nom: postre.producte__nom,
                  })
                }
              >
                {postre.producte__nom}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </FormControl>
      <Button colorScheme="blue" onClick={handleSubmit}>
        Crear Menu
      </Button>
      <Button colorScheme="red" onClick={onClose}>
        Cancel
      </Button>
    </VStack>
  );
};

export default MenuForm;
