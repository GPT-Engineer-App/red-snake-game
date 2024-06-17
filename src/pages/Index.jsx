import React, { useState, useEffect, useRef } from "react";
import { Container, Text, VStack, Box } from "@chakra-ui/react";

const SNAKE_COLOR = "red";
const FOOD_COLOR = "green";
const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 8, y: 8 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };

const Index = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(generateFood());
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const boardRef = useRef(null);

  const generateFood = () => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };
        head.x += direction.x;
        head.y += direction.y;

        if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE || isCollision(newSnake, head)) {
          setGameOver(true);
          return prevSnake;
        }

        newSnake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  const isCollision = (snake, head) => {
    return snake.some((segment) => segment.x === head.x && segment.y === head.y);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Snake Game</Text>
        <Box
          ref={boardRef}
          width={`${BOARD_SIZE * 20}px`}
          height={`${BOARD_SIZE * 20}px`}
          position="relative"
          border="1px solid black"
          bg="white"
        >
          {snake.map((segment, index) => (
            <Box
              key={index}
              position="absolute"
              width="20px"
              height="20px"
              bg={SNAKE_COLOR}
              style={{ left: `${segment.x * 20}px`, top: `${segment.y * 20}px` }}
            />
          ))}
          <Box
            position="absolute"
            width="20px"
            height="20px"
            bg={FOOD_COLOR}
            style={{ left: `${food.x * 20}px`, top: `${food.y * 20}px` }}
          />
        </Box>
        {gameOver && <Text fontSize="xl" color="red.500">Game Over</Text>}
        <button onClick={resetGame}>Restart Game</button>
      </VStack>
    </Container>
  );
};

export default Index;