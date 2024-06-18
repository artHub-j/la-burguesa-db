import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import Select from "react-select";

interface Ingredient {
  nom: string;
  preu: number;
}

interface HamburguesaDetails {
  descripcio: string;
  ingredients_conte: string[];
}

interface MenuDetails {
  hamburguesa: number;
  acompanyament: number;
  beguda: number;
  postre: number;
}

interface AcompanyamentDetails {
  descripcio: string;
}

interface BegudaDetails {
  // Define properties for beguda details if any
}

interface PostreDetails {
  descripcio: string;
}

interface Product {
  id: number;
  nom: string;
  preu: number;
  tipus: "Hamburguesa" | "Acompanyament" | "Beguda" | "Menu" | "Postre";
  detalls:
    | HamburguesaDetails
    | MenuDetails
    | AcompanyamentDetails
    | BegudaDetails
    | PostreDetails;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [nom, setNom] = useState("");
  const [preu, setPreu] = useState("");
  const [descripcio, setDescripcio] = useState("");
  const [ingredientsConte, setIngredientsConte] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [hamburguesa, setHamburguesa] = useState<number | null>(null);
  const [acompanyament, setAcompanyament] = useState<number | null>(null);
  const [beguda, setBeguda] = useState<number | null>(null);
  const [postre, setPostre] = useState<number | null>(null);
  const [hamburguesaOptions, setHamburguesaOptions] = useState([]);
  const [acompanyamentOptions, setAcompanyamentOptions] = useState([]);
  const [begudaOptions, setBegudaOptions] = useState([]);
  const [postreOptions, setPostreOptions] = useState([]);
  const toast = useToast();

  useEffect(() => {
    if (product) {
      setNom(product.nom);
      setPreu(product.preu.toString());

      switch (product.tipus) {
        case "Hamburguesa":
          const hamburguesaDetails = product.detalls as HamburguesaDetails;
          setDescripcio(hamburguesaDetails.descripcio || "");
          setIngredientsConte(hamburguesaDetails.ingredients_conte || []);
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
          break;
        case "Acompanyament":
          const acompanyamentDetails = product.detalls as AcompanyamentDetails;
          setDescripcio(acompanyamentDetails.descripcio || "");
          break;
        case "Postre":
          const postreDetails = product.detalls as PostreDetails;
          setDescripcio(postreDetails.descripcio || "");
          break;
        case "Menu":
          const menuDetails = product.detalls as MenuDetails;
          setHamburguesa(menuDetails.hamburguesa || null);
          setAcompanyament(menuDetails.acompanyament || null);
          setBeguda(menuDetails.beguda || null);
          setPostre(menuDetails.postre || null);

          fetch("http://127.0.0.1:8000/productes/hamburgueses/")
            .then((response) => response.json())
            .then((data) =>
              setHamburguesaOptions(
                data.map((hamburguesa: any) => ({
                  value: hamburguesa.producte_id,
                  label: hamburguesa.producte__nom,
                }))
              )
            )
            .catch((error) =>
              console.error("Error fetching hamburguesa options:", error)
            );

          fetch("http://127.0.0.1:8000/productes/acompanyaments/")
            .then((response) => response.json())
            .then((data) =>
              setAcompanyamentOptions(
                data.map((acompanyament: any) => ({
                  value: acompanyament.producte_id,
                  label: acompanyament.producte__nom,
                }))
              )
            )
            .catch((error) =>
              console.error("Error fetching acompanyament options:", error)
            );

          fetch("http://127.0.0.1:8000/productes/begudes/")
            .then((response) => response.json())
            .then((data) =>
              setBegudaOptions(
                data.map((beguda: any) => ({
                  value: beguda.producte_id,
                  label: beguda.producte__nom,
                }))
              )
            )
            .catch((error) =>
              console.error("Error fetching beguda options:", error)
            );

          fetch("http://127.0.0.1:8000/productes/postres/")
            .then((response) => response.json())
            .then((data) =>
              setPostreOptions(
                data.map((postre: any) => ({
                  value: postre.producte_id,
                  label: postre.producte__nom,
                }))
              )
            )
            .catch((error) =>
              console.error("Error fetching postre options:", error)
            );
          break;
        // Handle Beguda if there are any specific details
      }
    }
  }, [product, toast]);

  const handleSave = () => {
    if (!product) return;

    const payload: any = {
      nom,
      preu,
    };

    if (product.tipus === "Hamburguesa") {
      payload.descripcio = descripcio;
      payload.ingredients_conte = ingredientsConte;
    } else if (
      product.tipus === "Acompanyament" ||
      product.tipus === "Postre"
    ) {
      payload.descripcio = descripcio;
    } else if (product.tipus === "Menu") {
      payload.hamburguesa = hamburguesa;
      payload.acompanyament = acompanyament;
      payload.beguda = beguda;
      payload.postre = postre;
    }

    fetch(
      `http://127.0.0.1:8000/productes/edit_${product.tipus.toLowerCase()}/${
        product.id
      }/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast({
            title: "Error",
            description: data.error,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Success",
            description: `${product.tipus} updated successfully.`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          onClose();
        }
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit {product?.tipus}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Nom</FormLabel>
            <Input
              placeholder="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Preu</FormLabel>
            <Input
              placeholder="Preu"
              type="number"
              value={preu}
              onChange={(e) => setPreu(e.target.value)}
            />
          </FormControl>
          {product?.tipus === "Hamburguesa" && (
            <>
              <FormControl>
                <FormLabel>Descripcio</FormLabel>
                <Input
                  placeholder="Descripcio"
                  value={descripcio}
                  onChange={(e) => setDescripcio(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Ingredients Conte</FormLabel>
                <Select
                  isMulti
                  value={ingredientsConte.map((nom) => ({
                    value: nom,
                    label:
                      ingredients.find((ingredient) => ingredient.nom === nom)
                        ?.nom || "Unknown",
                  }))}
                  onChange={(selectedOptions) => {
                    setIngredientsConte(
                      selectedOptions.map((option) => option.value)
                    );
                  }}
                  options={ingredients.map((ingredient) => ({
                    value: ingredient.nom,
                    label: ingredient.nom,
                  }))}
                />
              </FormControl>
            </>
          )}
          {(product?.tipus === "Acompanyament" ||
            product?.tipus === "Postre") && (
            <FormControl>
              <FormLabel>Descripcio</FormLabel>
              <Input
                placeholder="Descripcio"
                value={descripcio}
                onChange={(e) => setDescripcio(e.target.value)}
              />
            </FormControl>
          )}
          {product?.tipus === "Menu" && (
            <>
              <FormControl>
                <FormLabel>Hamburguesa</FormLabel>
                <Select
                  value={hamburguesaOptions.find(
                    (option) => option.value === hamburguesa
                  )}
                  onChange={(selectedOption) =>
                    setHamburguesa(selectedOption?.value || null)
                  }
                  options={hamburguesaOptions}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Acompanyament</FormLabel>
                <Select
                  value={acompanyamentOptions.find(
                    (option) => option.value === acompanyament
                  )}
                  onChange={(selectedOption) =>
                    setAcompanyament(selectedOption?.value || null)
                  }
                  options={acompanyamentOptions}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Beguda</FormLabel>
                <Select
                  value={begudaOptions.find(
                    (option) => option.value === beguda
                  )}
                  onChange={(selectedOption) =>
                    setBeguda(selectedOption?.value || null)
                  }
                  options={begudaOptions}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Postre</FormLabel>
                <Select
                  value={postreOptions.find(
                    (option) => option.value === postre
                  )}
                  onChange={(selectedOption) =>
                    setPostre(selectedOption?.value || null)
                  }
                  options={postreOptions}
                />
              </FormControl>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProductModal;
