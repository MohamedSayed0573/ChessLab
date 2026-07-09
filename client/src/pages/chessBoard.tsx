import {
  Chessboard,
  type ChessboardOptions,
  type PieceDropHandlerArgs,
} from "react-chessboard";
import { Chess } from "chess.js";
import { useEffect, useRef, useState } from "react";
import NavBar from "../components/navBar";
import { socket } from "../socket";

export default function ChessBoard() {
  // create a chess game using a ref to always have access to the latest game state within closures and maintain the game state across renders
  const chessGameRef = useRef(new Chess());

  // track the current position of the chess game in state to trigger a re-render of the chessboard
  const [chessPosition, setChessPosition] = useState(() => new Chess().fen());
  const [color, setColor] = useState<"white" | "black">("white");
  const [socketId, setSocketId] = useState<string>();

  useEffect(() => {
    socket.on("moveRes", (fen) => {
      chessGameRef.current.load(fen);
      setChessPosition(chessGameRef.current.fen());
    });

    socket.on("color", (res: "white" | "black") => {
      setColor(res);
    });

    socket.on("connect", () => {
      setSocketId(socket.id);
      socket.emit("start");
    });

    socket.connect();

    return () => {
      socket.off("moveRes");
      socket.off("color");
      socket.off("connect");
      socket.disconnect();
    };
  }, []);

  // // make a random "CPU" move
  // function makeRandomMove() {
  //   // get all possible moves`
  //   const possibleMoves = chessGame.moves();

  //   // exit if the game is over
  //   if (chessGame.isGameOver()) {
  //     return;
  //   }

  //   // pick a random move
  //   const randomMove =
  //     possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

  //   // make the move
  //   chessGame.move(randomMove);

  //   // update the position state
  //   setChessPosition(chessGame.fen());
  // }

  // handle piece drop
  function onPieceDrop({
    sourceSquare,
    targetSquare,
    piece,
  }: PieceDropHandlerArgs) {
    // type narrow targetSquare potentially being null (e.g. if dropped off board)
    if (!targetSquare) {
      return false;
    }

    socket.emit("move", {
      piece: piece.pieceType,
      from: sourceSquare,
      to: targetSquare,
    });

    return true;

    // try to make the move according to chess.js logic
    // try {
    //   chessGame.move({
    //     from: sourceSquare,
    //     to: targetSquare,
    //     promotion: "q", // always promote to a queen for example simplicity
    //   });

    // update the position state upon successful move to trigger a re-render of the chessboard
    //setChessPosition(chessGame.fen());

    // make random cpu move after a short delay
    //setTimeout(makeRandomMove, 500);

    // return true as the move was successful
    //   return true;
    // } catch {
    //   // return false as the move was not successful
    //   return false;
    // }
  }

  // set the chessboard options
  const chessboardOptions: ChessboardOptions = {
    position: chessPosition,
    onPieceDrop,
    id: "play-vs-random",
    boardOrientation: color,
  };

  console.log(socketId);

  // render the chessboard
  return (
    <>
      <div className="flex h-screen">
        <NavBar />
        <div>{socketId}</div>
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
