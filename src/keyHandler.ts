export const keyHandler =
  (setVector: React.Dispatch<React.SetStateAction<[number, number]>>) =>
  (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        setVector(() => [-1, 0]);
        break;
      case "ArrowDown":
        e.preventDefault();
        setVector(() => [1, 0]);
        break;
      case "ArrowLeft":
        e.preventDefault();
        setVector(() => [0, -1]);
        break;
      case "ArrowRight":
        e.preventDefault();
        setVector(() => [0, 1]);
        break;
    }
  };
