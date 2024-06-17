import React, { useState } from "react";
import { Container, Box, Button, VStack, Input, Text } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import ReactPlayer from "react-player";

const VideoEditor = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [trimmedVideo, setTrimmedVideo] = useState(null);

  const onDrop = (acceptedFiles) => {
    setVideoFile(URL.createObjectURL(acceptedFiles[0]));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleTrim = () => {
    // Placeholder for trimming logic
    console.log(`Trimming video from ${startTime} to ${endTime}`);
    setTrimmedVideo(videoFile); // This should be replaced with actual trimmed video URL
  };

  return (
    <Container centerContent>
      <VStack spacing={4} width="100%">
        <Box {...getRootProps()} border="2px dashed gray" padding={4} width="100%" textAlign="center">
          <input {...getInputProps()} />
          <Text>Drag & drop a video here, or click to select one</Text>
        </Box>
        {videoFile && (
          <Box width="100%">
            <ReactPlayer url={videoFile} controls width="100%" />
            <VStack spacing={2} mt={4}>
              <Input
                type="number"
                placeholder="Start Time (seconds)"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <Input
                type="number"
                placeholder="End Time (seconds)"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
              <Button onClick={handleTrim}>Trim Video</Button>
            </VStack>
          </Box>
        )}
        {trimmedVideo && (
          <Box width="100%" mt={4}>
            <Text>Trimmed Video:</Text>
            <ReactPlayer url={trimmedVideo} controls width="100%" />
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default VideoEditor;