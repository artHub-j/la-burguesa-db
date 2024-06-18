// components/HomePage.tsx
import React from "react";
import { Box, Text } from "@chakra-ui/react";

const HomePage: React.FC = () => {
  return (
    <Box textAlign="center" p={6} mt={10}>
      <Text fontSize="3xl" fontWeight="bold">
        Admin, welcome to La Burguesa DB!
      </Text>
    </Box>
  );
};

export default HomePage;
