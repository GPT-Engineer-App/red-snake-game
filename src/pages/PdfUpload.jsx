import React, { useState } from "react";
import { Container, Box, Button, VStack, Input, Text } from "@chakra-ui/react";

const PdfUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [translatedContent, setTranslatedContent] = useState("");

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
        const pdfContent = await response.text(); // Assuming the server returns the PDF content as text
        const translatedText = await translateToChinese(pdfContent);
        setTranslatedContent(translatedText);
        setMessage("File uploaded and translated successfully!");
      } else {
        setMessage("File upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("An error occurred during file upload. Please try again.");
    }
  };

  const translateToChinese = async (text) => {
    try {
      const response = await fetch("https://translation.googleapis.com/language/translate/v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          target: "zh",
          format: "text",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.data.translations[0].translatedText;
      } else {
        console.error("Translation API error:", response.statusText);
        return text;
      }
    } catch (error) {
      console.error("Error translating text:", error);
      return text;
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
        {translatedContent && (
          <Box mt={4} p={4} border="1px solid gray" width="100%">
            <Text>{translatedContent}</Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default PdfUpload;