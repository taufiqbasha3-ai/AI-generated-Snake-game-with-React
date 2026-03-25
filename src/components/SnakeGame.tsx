import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, GAME_SPEED } from '../constants';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  isPaused: boolean;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange, isPaused }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('UP');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
    setDirection('UP');
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setFood(generateFood([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (direction) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check collisions
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            onScoreChange(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, isPaused, generateFood, onScoreChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw raw grid lines
    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.2;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Draw food (Magenta block)
    ctx.fillStyle = '#FF00FF';
    ctx.fillRect(
      food.x * cellSize + 2,
      food.y * cellSize + 2,
      cellSize - 4,
      cellSize - 4
    );

    // Draw snake (Cyan blocks)
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#FFFFFF' : '#00FFFF';
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
    });
  }, [snake, food]);

  return (
    <div className="relative group">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="bg-black"
      />
      
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 border-4 border-[#FF00FF]">
          <h2 className="text-6xl md:text-7xl text-magenta-cyan mb-4 glitch-text" data-text="CRITICAL_FAIL">CRITICAL_FAIL</h2>
          <p className="text-3xl text-[#00FFFF] mb-8 bg-black px-4 py-2 border-2 border-[#00FFFF]">FRAGMENTS_LOST: {score}</p>
          <button
            onClick={resetGame}
            className="px-8 py-4 bg-[#00FFFF] text-black text-2xl font-bold hover:bg-[#FF00FF] hover:text-white transition-none active:translate-y-2 border-4 border-black outline outline-2 outline-[#00FFFF]"
          >
            REBOOT_SYSTEM
          </button>
        </div>
      )}

      {isPaused && !gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 border-4 border-[#00FFFF] screen-tear">
          <p className="text-5xl text-cyan-magenta glitch-text" data-text="SYSTEM_HALTED">SYSTEM_HALTED</p>
          <p className="text-xl text-[#FF00FF] mt-4 animate-pulse">AWAITING AUDIO STREAM...</p>
        </div>
      )}
    </div>
  );
};
