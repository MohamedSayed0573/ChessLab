import {
  type ChessboardOptions,
  type PieceDropHandlerArgs,
} from "react-chessboard";
import { useRef, useState } from "react";
import { Chess } from "chess.js";
import Layout from "../components/layout";
import ChessBoard from "../components/chessBoard";

export default function ComputerChessBoard() {
  // create a chess game using a ref to always have access to the latest game state within closures and maintain the game state across renders
  const chessGameRef = useRef(new Chess());

  // track the current position of the chess game in state to trigger a re-render of the chessboard
  const [chessPosition, setChessPosition] = useState(() => new Chess().fen());
  // make a random "CPU" move
  function makeRandomMove() {
    // get all possible moves`
    const possibleMoves = chessGameRef.current.moves();

    // exit if the game is over
    if (
      chessGameRef.current.isGameOver() ||
      chessGameRef.current.turn() !== "b"
    ) {
      return;
    }

    // pick a random move
    const randomMove =
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

    // make the move
    chessGameRef.current.move(randomMove!);

    // update the position state
    setChessPosition(chessGameRef.current.fen());
  }

  // handle piece drop
  function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
    // type narrow targetSquare potentially being null (e.g. if dropped off board)
    if (!targetSquare || chessGameRef.current.turn() !== "w") {
      return false;
    }
    try {
      chessGameRef.current.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for example simplicity
      });

      setChessPosition(chessGameRef.current.fen());

      setTimeout(makeRandomMove, 500);

      return true;
    } catch {
      // return false as the move was not successful
      return false;
    }
  }

  const chessboardOptions: ChessboardOptions = {
    position: chessPosition,
    onPieceDrop,
    id: "play-vs-random",
    //boardOrientation: color,
  };

  return (
    <>
      <Layout>
        <ChessBoard chessboardOptions={chessboardOptions} />
      </Layout>
    </>
  );
}
