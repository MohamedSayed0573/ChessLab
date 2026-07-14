import {
  type ChessboardOptions,
  type PieceDropHandlerArgs,
} from "react-chessboard";
import { Chess } from "chess.js";
import { useEffect, useMemo, useState } from "react";
import { socket } from "../socket";
import { useParams } from "react-router";
import type { JoinGameRes } from "../../../shared/src/types";
import Layout from "../components/layout";
import ChessBoard from "../components/chessBoard";

export default function PlayerGame() {
  const { roomId } = useParams();

  // track the current position of the chess game in state to trigger a re-render of the chessboard
  const [chessPosition, setChessPosition] = useState(() => new Chess().fen());
  const [color, setColor] = useState<"white" | "black">("white");
  const [gameResult, setGameResult] = useState<string | undefined>();
  const [winner, setWinner] = useState<"white" | "black" | undefined>();

  useEffect(() => {
    if (!roomId) return;

    function handleMove(fen: string) {
      setChessPosition(fen);
    }

    function joinGame() {
      socket.emit("joinGame", roomId, (res: JoinGameRes) => {
        if (!res.success) return;
        setColor(res.color);
      });
    }

    function handleGameOver({
      reason,
      winner,
    }: {
      reason: string;
      winner?: "white" | "black";
    }) {
      setGameResult(reason);
      setWinner(winner);
    }

    socket.on("moveRes", handleMove);
    socket.on("gameOver", handleGameOver);
    socket.on("connect", joinGame);

    if (socket.connected) {
      joinGame();
    } else {
      socket.connect();
    }

    return () => {
      socket.off("moveRes", handleMove);
      socket.off("gameOver", handleGameOver);
      socket.off("connect", joinGame);
    };
  }, [roomId]);

  const turn = useMemo(
    () => (new Chess(chessPosition).turn() === "w" ? "White" : "Black"),
    [chessPosition],
  );

  // handle piece drop
  function onPieceDrop({
    sourceSquare,
    targetSquare,
    piece,
  }: PieceDropHandlerArgs) {
    // type narrow targetSquare potentially being null (e.g. if dropped off board)
    if (!targetSquare || gameResult) {
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
        <div>
          <div>{`You are playing as ${color}`}</div>
          <div>
            {gameResult
              ? winner
                ? `Game over: ${gameResult}. Winner is ${winner}`
                : `Game over: ${gameResult}`
              : `This is ${turn}'s turn`}
          </div>
        </div>
        <ChessBoard chessboardOptions={chessboardOptions} />
      </Layout>
    </>
  );
}
