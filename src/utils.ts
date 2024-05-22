import { Snake } from "./components/Grid";

export const getInitialSnake = (
  gridHeight: number,
  gridWidth: number
): Snake => {
  return [[~~(gridHeight / 2), ~~(gridWidth / 2)]];
};
