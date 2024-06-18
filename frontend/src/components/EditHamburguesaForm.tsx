import React, { useState, useEffect } from 'react';
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
  Select,
  useToast,
} from '@chakra-ui/react';

interface Ingredient {
  id: number;
  nom: string;
}

interface EditHamburguesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  hamburguesaId: number | null;
}

const EditHamburguesaModal: React.FC<EditHamburguesaModalProps> = ({ isOpen, onClose, hamburguesaId }) => {
  const [nom, setNom] = useState('');
  const [preu, setPreu] = useState('');
  const [descripcio, setDescripcio] = useState('');
  const [ingredientsConte, setIngredientsConte] = useState<number[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const toast = useToast();

  useEffect(() => {
    if (hamburguesaId) {
      // Fetch the hamburguesa details
      fetch(`/api/hamburguesa/${hamburguesaId}/`)
        .then((response) => response.json())
        .then((data) => {
          setNom(data.nom);
          setPreu(data.preu);
          setDescripcio(data.descripcio);
          setIngredientsConte(data.ingredients_conte.map((ing: Ingredient) => ing.id));
        });

      // Fetch all available ingredients
      fetch('/api/ingredients/')
        .then((response) => resp
