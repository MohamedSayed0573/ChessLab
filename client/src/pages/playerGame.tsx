import {
  type ChessboardOptions,
  type PieceDropHandlerArgs,
} from "react-chessboard";
import { Chess } from "chess.js";
import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import { useParams } from "react-router";
import type { JoinGameRes } from "../../../shared/src/types";
import Layout from "../components/layout";
import ChessBoard from "../components/chessBoard";

export default function PlayerGame() {
  const { roomId } = useParams();

  // create a chess game using a ref to always have access to the latest game state within closures and maintain the game state across renders
  const chessGameRef = useRef(new Chess());

  // track the current position of the chess game in state to trigger a re-render of the chessboard
  const [chessPosition, setChessPosition] = useState(() => new Chess().fen());
  const [color, setColor] = useState<"white" | "black">("white");

  useEffect(() => {
    if (!roomId) return;

    function handleMove(fen: string) {
      chessGameRef.current.load(fen);
      setChessPosition(chessGameRef.current.fen());
    }

    function joinGame() {
      socket.emit("joinGame", roomId, (res: JoinGameRes) => {
        if (!res.success) return;
        setColor(res.color);
      });
    }

    socket.on("moveRes", handleMove);
    socket.on("connect", joinGame);

    if (socket.connected) {
      joinGame();
    } else {
      socket.connect();
    }

    return () => {
      socket.off("moveRes", handleMove);
      socket.off("connect", joinGame);
    };
  }, [roomId]);

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
  }

  // set the chessboard options
  const chessboardOptions: ChessboardOptions = {
    position: chessPosition,
    onPieceDrop,
    id: roomId,
    boardOrientation: color,
  };

  // render the chessboard
  return (
    <>
      <Layout>
        <ChessBoard chessboardOptions={chessboardOptions} />
      </Layout>
    </>
  );
}
