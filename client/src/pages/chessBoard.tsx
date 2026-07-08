import {
  Chessboard,
  type ChessboardOptions,
  type PieceDropHandlerArgs,
} from "react-chessboard";
import { Chess } from "chess.js";
import { useEffect, useRef, useState } from "react";
import NavBar from "../components/navBar";
import { io } from "socket.io-client";

export default function ChessBoard() {
  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("Connected! Socket ID:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // create a chess game using a ref to always have access to the latest game state within closures and maintain the game state across renders
  const chessGameRef = useRef(new Chess());
  const chessGame = chessGameRef.current;

  // track the current position of the chess game in state to trigger a re-render of the chessboard
  const [chessPosition, setChessPosition] = useState(chessGame.fen());

  // make a random "CPU" move
  function makeRandomMove() {
    // get all possible moves`
    const possibleMoves = chessGame.moves();

    // exit if the game is over
    if (chessGame.isGameOver()) {
      return;
    }

    // pick a random move
    const randomMove =
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

    // make the move
    chessGame.move(randomMove);

    // update the position state
    setChessPosition(chessGame.fen());
  }

  // handle piece drop
  function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
    // type narrow targetSquare potentially being null (e.g. if dropped off board)
    if (!targetSquare) {
      return false;
    }

    // try to make the move according to chess.js logic
    try {
      chessGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for example simplicity
      });

      // update the position state upon successful move to trigger a re-render of the chessboard
      setChessPosition(chessGame.fen());

      // make random cpu move after a short delay
      setTimeout(makeRandomMove, 500);

      // return true as the move was successful
      return true;
    } catch {
      // return false as the move was not successful
      return false;
    }
  }

  // set the chessboard options
  const chessboardOptions: ChessboardOptions = {
    position: chessPosition,
    onPieceDrop,
    id: "play-vs-random",
  };

  // render the chessboard
  return (
    <>
      <div className="flex h-screen">
        <NavBar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div
            className="aspect-square"
            style={{
              maxHeight: "calc(100vh - 36px)",
              maxWidth: "calc(100vh - 36px)",
            }}
          >
            <Chessboard options={chessboardOptions} />
          </div>
        </div>
      </div>
    </>
  );
}
