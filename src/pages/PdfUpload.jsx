import React, { useState } from "react";
import { Container, Box, Button, VStack, Input, Text } from "@chakra-ui/react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [numPages, setNumPages] = useState(null);

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
        const translatedPdf = await response.blob();
        const translatedPdfUrl = URL.createObjectURL(translatedPdf);
        setFile(translatedPdfUrl);
        setMessage("File uploaded and translated successfully!");
      } else {
        setMessage("File upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("An error occurred during file upload. Please try again.");
    }
  };

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <Container centerContent>
      <VStack spacing={4} width="100%">
        <Box as="form" onSubmit={handleSubmit} width="100%">
          <Input type="file" accept="application/pdf" onChange={handleFileChange} />
          <Button type="submit" mt={4}>Upload PDF</Button>
        </Box>
        {message && <Text>{message}</Text>}
        {file && (
          <Document
            file={file}
            onLoadSuccess={onLoadSuccess}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        )}
      </VStack>
    </Container>
  );
};

export default PdfUpload;