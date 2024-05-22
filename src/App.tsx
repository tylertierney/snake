import { useEffect, useState } from "react";
import Grid from "./components/Grid";
import "./index.css";

export interface Game {
  score: number;
  active: boolean;
}

export default function App() {
  const [gridDimensions, setGridDimensions] = useState({
    width: 10,
    height: 10,
  });
  const [game, setGame] = useState<Game>({ score: 0, active: true });

  useEffect(() => {
    const enterHandler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setGame(() => ({ score: 0, active: true }));
      }
    };
    document.addEventListener("keydown", enterHandler);

    return () => document.removeEventListener("keydown", enterHandler);
  }, []);

  return (
    <div className="App">
      <label htmlFor="heightInput">
        Height
        <input
          disabled={game.active}
          type="number"
          name="heightInput"
          id="heightInput"
          value={gridDimensions.height}
          min={2}
          max={25}
          pattern="[0-9]+"
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            setGridDimensions((prev) => ({
              ...prev,
              height: value ? value : 10,
            }));
          }}
        />
      </label>
      <label>
        Width
        <input
          disabled={game.active}
          type="number"
          name="widthInput"
          id="widthInput"
          value={gridDimensions.width}
          min={2}
          max={25}
          pattern="[0-9]+"
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            setGridDimensions((prev) => ({
              ...prev,
              width: value ? value : 10,
            }));
          }}
        />
      </label>
      <Grid game={game} setGame={setGame} gridDimensions={gridDimensions} />
      {!game.active && (
        <div>
          <h3>Game Over</h3>
          <button onClick={() => setGame(() => ({ score: 0, active: true }))}>
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
