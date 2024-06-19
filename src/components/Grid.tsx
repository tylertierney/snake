import { useEffect, useState } from "react";
import { Game } from "../App";
import { keyHandler } from "../keyHandler";
import { getInitialSnake } from "../utils";
import "../index.css";

type Square = [number, number];
export type Snake = Array<Square>;

const getRandomEmptySquare = (
  gridHeight: number,
  gridWidth: number,
  snake: Snake
): Square => {
  const randomR = ~~(Math.random() * gridHeight);
  const randomC = ~~(Math.random() * gridWidth);

  for (let i = 0; i < gridHeight * gridWidth; i++) {
    const curr =
      (i + (randomR * gridHeight + randomC)) % (gridWidth * gridHeight);
    const currR = ~~(curr / gridHeight);
    const currC = curr % gridWidth;

    if (!snake.some(([r, c]) => r === currR && c === currC)) {
      return [currR, currC];
    }
  }

  return [0, 0];
};

const initializeGrid = (height: number, width: number) =>
  Array(height)
    .fill(null)
    .map(() => Array(width).fill(null));

export interface GridProps {
  gridDimensions: {
    height: number;
    width: number;
  };
  game: Game;
  setGame: React.Dispatch<React.SetStateAction<Game>>;
}

const moveSnake = (
  setSnake: React.Dispatch<React.SetStateAction<Snake>>,
  vector: [number, number],
  apple: Square,
  setApple: React.Dispatch<React.SetStateAction<Square>>,
  gridHeight: number,
  gridWidth: number,
  game: Game
) => {
  if (!game.active) return;
  setSnake((snake) => {
    const head = snake[0];
    const newR = head[0] + vector[0];
    const newC = head[1] + vector[1];

    const newSnake = [...snake];

    if (newR === apple[0] && newC === apple[1]) {
      newSnake.unshift([newR, newC]);
      setApple(() => getRandomEmptySquare(gridHeight, gridWidth, newSnake));
    } else {
      newSnake.pop();
      newSnake.unshift([newR, newC]);
    }
    return newSnake;
  });
};

export default function Grid({ gridDimensions, game, setGame }: GridProps) {
  const [vector, setVector] = useState<[number, number]>([0, 0]);
  const [snake, setSnake] = useState<Snake>(
    getInitialSnake(gridDimensions.height, gridDimensions.width)
  );

  const [apple, setApple] = useState<Square>(
    getRandomEmptySquare(gridDimensions.height, gridDimensions.width, snake)
  );

  useEffect(() => {
    const arrowKeyListener = keyHandler(setVector);
    document.addEventListener("keydown", arrowKeyListener);
    return () => {
      document.removeEventListener("keydown", arrowKeyListener);
    };
  }, [setVector]);

  useEffect(() => {
    if (vector[0] === 0 && vector[1] === 0) return;
    const handler = () =>
      moveSnake(
        setSnake,
        vector,
        apple,
        setApple,
        gridDimensions.height,
        gridDimensions.width,
        game
      );
    const interval = setInterval(handler, 225);
    if (!game.active) clearInterval(interval);
    return () => clearInterval(interval);
  }, [vector, setSnake, setApple, apple, game]);

  useEffect(() => {
    moveSnake(
      setSnake,
      vector,
      apple,
      setApple,
      gridDimensions.height,
      gridDimensions.width,
      game
    );
  }, [vector]);

  useEffect(() => {
    const head = snake[0];
    const newR = head[0];
    const newC = head[1];

    if (
      snake.slice(1).some(([r, c]) => {
        return r === newR && c === newC;
      })
    ) {
      setGame((game) => ({ ...game, active: false }));
    }

    if (
      snake.some(() => {
        return (
          newR < 0 ||
          newR >= gridDimensions.height ||
          newC < 0 ||
          newC >= gridDimensions.width
        );
      })
    ) {
      setGame((game) => ({ ...game, active: false }));
    }
  }, [snake, setGame]);

  useEffect(() => {
    if (game.active) {
      setSnake(getInitialSnake(gridDimensions.height, gridDimensions.width));
      setVector([0, 0]);
      setApple(() =>
        getRandomEmptySquare(gridDimensions.height, gridDimensions.width, snake)
      );
    }
  }, [game]);

  const grid = initializeGrid(gridDimensions.height, gridDimensions.width);

  return (
    <div className="grid-wrapper">
      <div className="score">
        <span className="score-literal">Score:</span>
        <span className="score-value">{(snake.length - 1) * 100}</span>
      </div>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${gridDimensions.width}, 1fr)`,
          gridTemplateRows: `repeat(${gridDimensions.height}, 1fr)`,
        }}
      >
        {grid.map((row, r) => {
          return row.map((_, c) => {
            const hasSnake = snake.some(
              ([snakeR, snakeC]) => snakeR === r && snakeC === c
            );
            const isHead = r === snake[0][0] && c === snake[0][1];
            const hasApple = apple[0] === r && apple[1] === c;
            return (
              <div
                key={`square_${r}_${c}`}
                id={`square_${r}_${c}`}
                className={`square ${hasApple ? "apple" : ""} ${
                  hasSnake ? "tail" : ""
                } ${isHead ? "head" : ""}`}
              ></div>
            );
          });
        })}
      </div>
      {!game.active && (
        <div className="game-over">
          <h3 className="game-over-literal">Game Over</h3>
          <button
            className="reset-btn"
            onClick={() => setGame(() => ({ score: 0, active: true }))}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
