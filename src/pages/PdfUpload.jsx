import React, { useState } from "react";
import { Container, Box, Button, VStack, Input, Text, HStack } from "@chakra-ui/react";
import { Document, Page, pdfjs } from "react-pdf";
import { saveAs } from "file-saver";
import { translateText } from "../utils/translate";

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

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

  const handleDownload = () => {
    const blob = new Blob(translatedPages, { type: "application/pdf" });
    saveAs(blob, "translated.pdf");
  };

  return (
    <Container centerContent>
      <VStack spacing={4} width="100%">
        <Box as="form" onSubmit={handleSubmit} width="100%">
          <Input type="file" accept="application/pdf" onChange={handleFileChange} />
          <Button type="submit" mt={4}>Upload PDF</Button>
        </Box>
        {message && <Text>{message}</Text>}
        <HStack spacing={4} width="100%">
          <Box width="50%">
            {file && (
              <Document file={file}>
                {Array.from(new Array(numPages), (el, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
              </Document>
            )}
          </Box>
          <Box width="50%">
            {translatedPages.length > 0 && (
              <Box width="100%">
                {translatedPages.map((page, index) => (
                  <Box key={index} p={4} border="1px solid black" mb={4}>
                    <Text>{page}</Text>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </HStack>
        {translatedPages.length > 0 && (
          <Button onClick={handleDownload} mt={4}>Download Translated PDF</Button>
        )}
      </VStack>
    </Container>
  );
};

export default PdfUpload;