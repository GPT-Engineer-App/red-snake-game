import React, { useState } from "react";
import { Container, Box, Button, VStack, Input, Text } from "@chakra-ui/react";
import { Document, Page, pdfjs } from "react-pdf";
import { pdfjsWorker } from "react-pdf/dist/esm/entry.webpack";
import { translateText } from "../utils/translate";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfUpload = () => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [translatedPages, setTranslatedPages] = useState([]);
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

    const reader = new FileReader();
    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result);
      const pdf = await pdfjs.getDocument(typedArray).promise;
      setNumPages(pdf.numPages);

      const translatedPages = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const textItems = textContent.items.map((item) => item.str).join(" ");
        const translatedText = await translateText(textItems, "zh");
        translatedPages.push(translatedText);
      }
      setTranslatedPages(translatedPages);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Container centerContent>
      <VStack spacing={4} width="100%">
        <Box as="form" onSubmit={handleSubmit} width="100%">
          <Input type="file" accept="application/pdf" onChange={handleFileChange} />
          <Button type="submit" mt={4}>Upload PDF</Button>
        </Box>
        {message && <Text>{message}</Text>}
        {translatedPages.length > 0 && (
          <Box width="100%">
            {translatedPages.map((page, index) => (
              <Box key={index} p={4} border="1px solid black" mb={4}>
                <Text>{page}</Text>
              </Box>
            ))}
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default PdfUpload;