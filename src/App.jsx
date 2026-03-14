import { useState } from 'react';
import './style.css'

const EMPTY_SQUARE = '';
const BOARD_DIMENSION = 3; // width and height of the square board
const BOARD_SIZE = BOARD_DIMENSION * BOARD_DIMENSION;


function Square({ value, onSquareClick }) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    )
}

function Board() {
    const [turn, setTurn] = useState('X');
    const [squares, setSquares] = useState(Array(BOARD_SIZE).fill(EMPTY_SQUARE));
    const [gameOver, setGameOver] = useState(false);

    function onClick(squareIndex) {
        if (gameOver) {
            return;
        }

        if (squares[squareIndex] != EMPTY_SQUARE) {
            // TODO(omar): inform the user the move is invalid
            return;
        }

        let newSquares = squares.slice();
        newSquares[squareIndex] = turn;
        setSquares(newSquares);

        if (checkWinner(newSquares)) {
            setGameOver(true);
            setTimeout(() => {
                setGameOver(false);
                setSquares(Array(BOARD_SIZE).fill(EMPTY_SQUARE));
            }, 2000)
            return;
        }
        else if (checkDraw(newSquares)) {
            setGameOver(true);
            setTimeout(() => {
                setGameOver(false);
                setSquares(Array(BOARD_SIZE).fill(EMPTY_SQUARE));
            }, 2000)
        }

        if (turn == 'X') {
            setTurn('O');
        }
        else {
            setTurn('X');
        }
    }

    let status = "";
    if (gameOver) {
        const winner = checkWinner(squares);
        if (winner) {
            status = winner + " won!";
        }
        else {
            status = "Its a draw!";
        }
    }
    else {
        status = "Next Player: " + turn;
    }

    const squareNodes = squares.map((square, i) => <Square key={i} value={squares[i]} onSquareClick={ () => onClick(i) }/>);
    const rowNodes = Array.from({ length: BOARD_DIMENSION }, (_, i) => (
    <div key={i} className="board-row">
        {squareNodes.slice(i * BOARD_DIMENSION, (i + 1) * BOARD_DIMENSION)}
    </div>
    ));

    return (
        <>
        <div className="status">{status}</div>
        <div className="board">
            {rowNodes}
        </div>
        </>
    );
}

export default function App() {
    return (
        <Board/>
    )
}

function checkDraw(board) {
    for (let square of board) {
        if (square == EMPTY_SQUARE) {
            return false;
        }
    }

    return true;
}

function checkWinner(board) {
    function checkLeftDiagonal(board) {
        let prevSquare = board[0];
        for (let i = 1; i < BOARD_DIMENSION; i++) {
            const square = board[i + (i * BOARD_DIMENSION)];

            if (square == EMPTY_SQUARE) {
                break;
            }

            if (square != prevSquare) {
                break;
            }
            else if (i == BOARD_DIMENSION-1) {
                return square;
            }
        }

        return null;
    }

    function checkRightDiagonal(board) {
        let x = BOARD_DIMENSION-1;
        let y = 0;
        let lastSquare = null; 
        while ((x >= 0) && (y < BOARD_DIMENSION)) {
            const square = board[x + (y * BOARD_DIMENSION)];
            if (square == EMPTY_SQUARE) {
                return null;
            }
            if (lastSquare != null) {
                if (square != lastSquare) {
                    return null;
                }
            }

            x--;
            y++;
            lastSquare = square;
        }

        return lastSquare;
    }

    function checkRows(board) {
        for (let y = 0; y < BOARD_DIMENSION; y++) {
            let prevSquare = null;
            for (let x = 0; x < BOARD_DIMENSION; x++) {
                const square = board[x + (y * BOARD_DIMENSION)];

                if (prevSquare === null) {
                    prevSquare = square;
                    continue;
                }
                if (square == EMPTY_SQUARE) {
                    break;
                }

                if (square != prevSquare) {
                    break;
                }
                else if (x == BOARD_DIMENSION-1) {
                    return square;
                }
            }
        }
        return null;
    }

    function checkCols(board) {
        for (let x = 0; x < BOARD_DIMENSION; x++) {
            let prevSquare = null;
            for (let y = 0; y < BOARD_DIMENSION; y++) {
                const square = board[x + (y * BOARD_DIMENSION)];

                if (prevSquare === null) {
                    prevSquare = square;
                    continue;
                }
                if (square == EMPTY_SQUARE) {
                    break;
                }

                if (square != prevSquare) {
                    break;
                }
                else if (y == BOARD_DIMENSION-1) {
                    return square;
                }
            }
        }
        return null;
    }

    if (!Array.isArray(board) || board.length != BOARD_SIZE) {
        console.error("Invalid board array");
        return null;
    }

    let winner = checkLeftDiagonal(board);
    if (winner) return winner;
    winner = checkRightDiagonal(board);
    if (winner) return winner;
    winner = checkRows(board);
    if (winner) return winner;
    winner = checkCols(board);

    return winner;
}