import React, { useState } from "react";
import { Container, Box, Button, VStack, Input, Text } from "@chakra-ui/react";

const PdfUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage("Please select a PDF file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("File uploaded successfully!");
      } else {
        setMessage("File upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("An error occurred during file upload. Please try again.");
    }
  };

  return (
    <Container centerContent>
      <VStack spacing={4} width="100%">
        <Box as="form" onSubmit={handleSubmit} width="100%">
          <Input type="file" accept="application/pdf" onChange={handleFileChange} />
          <Button type="submit" mt={4}>Upload PDF</Button>
        </Box>
        {message && <Text>{message}</Text>}
      </VStack>
    </Container>
  );
};

export default PdfUpload;