import { MouseEventHandler, useState } from "react";

type SquareValue = string | null;

function Square({
  value,
  index,
  onSquareClick,
}: {
  value: SquareValue;
  index: number;
  onSquareClick: MouseEventHandler<HTMLButtonElement>;
}) {
  function createAriaLabel(index: number, value: SquareValue) {
    return [
      value ? `Taken space. ${value}.` : `Open space.`,
      `Column ${Math.floor(index % 3) + 1}.`,
      `Row ${Math.floor(index / 3 + 1)}`,
    ]
      .join(" ")
      .trim();
  }

  return (
    <button
      className="square"
      onClick={onSquareClick}
      aria-label={createAriaLabel(index, value)}
    >
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));

  function handleClick(i: number) {
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <>
      <div className="board-row">
        <Square
          index={0}
          value={squares[0]}
          onSquareClick={() => handleClick(0)}
        />
        <Square
          index={1}
          value={squares[1]}
          onSquareClick={() => handleClick(1)}
        />
        <Square
          index={2}
          value={squares[2]}
          onSquareClick={() => handleClick(2)}
        />
      </div>
      <div className="board-row">
        <Square
          index={3}
          value={squares[3]}
          onSquareClick={() => handleClick(3)}
        />
        <Square
          index={4}
          value={squares[4]}
          onSquareClick={() => handleClick(4)}
        />
        <Square
          index={5}
          value={squares[5]}
          onSquareClick={() => handleClick(5)}
        />
      </div>
      <div className="board-row">
        <Square
          index={6}
          value={squares[6]}
          onSquareClick={() => handleClick(6)}
        />
        <Square
          index={7}
          value={squares[7]}
          onSquareClick={() => handleClick(7)}
        />
        <Square
          index={8}
          value={squares[8]}
          onSquareClick={() => handleClick(8)}
        />
      </div>
    </>
  );
}
