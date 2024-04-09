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

function calculateWinner(squares: SquareValue[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Board({
  xIsNext,
  squares,
  onPlay,
}: {
  xIsNext: boolean;
  squares: SquareValue[];
  onPlay: (squares: SquareValue[]) => void;
}) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
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

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: SquareValue[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((_squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
