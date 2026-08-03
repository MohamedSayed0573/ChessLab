import { type ChessboardOptions, type PieceDropHandlerArgs } from "react-chessboard";
import { Chess } from "chess.js";
import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useLocation, useParams } from "react-router";
import type {
	GameStateEvent,
	GameMoveEvent,
	MoveMadeEvent,
	PlayerJoinedEvent,
} from "@chesslab/shared/types";
import ChessBoard from "../components/chessBoard";
import type { LocationState } from "../types/types";
import SideBar from "../components/chessSidebar";

export default function PlayerGame() {
	const { gameId } = useParams();
	const { state } = useLocation();
	const { color, opponentId } = state as LocationState;

	const [chessPosition, setChessPosition] = useState(() => new Chess().fen());
	const [gameOverInfo, setGameOverInfo] = useState<GameStateEvent | undefined>();
	const [opponent, setOpponent] = useState<string | undefined>(opponentId);

	useEffect(() => {
		if (!gameId) return;

		function handleMove({ fen, turn }: MoveMadeEvent) {
			setChessPosition(fen);
		}

		function handleGameOver(gameOverInfo: GameStateEvent) {
			setGameOverInfo(gameOverInfo);
		}

		// You are the one created the game.
		function handleOpponentJoined({ opponentId, color, gameId }: PlayerJoinedEvent) {
			setOpponent(opponentId);
		}

		socket.on("game:game-move", handleMove);
		socket.on("game:game-over", handleGameOver);
		socket.on("game:move-made", handleMove);
		socket.on("game:PlayerJoined", handleOpponentJoined);

		return () => {
			socket.off("game:move-made", handleMove);
			socket.off("game:game-move", handleMove);
			socket.off("game:game-over", handleGameOver);
			socket.off("game:PlayerJoined", handleOpponentJoined);
		};
	}, [gameId]);

	// handle piece drop
	function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
		// type narrow targetSquare potentially being null (e.g. if dropped off board)
		if (!targetSquare || gameOverInfo?.gameOver) {
			return false;
		}

		socket.emit("game:move", {
			promotion: "q",
			from: sourceSquare,
			to: targetSquare,
		} as GameMoveEvent);

		return true;
	}

	// set the chessboard options
	const chessboardOptions: ChessboardOptions = {
		position: chessPosition,
		onPieceDrop,
		id: gameId!,
		boardOrientation: color === "w" ? "white" : "black",
	};

	// render the chessboard
	return (
		<>
			<div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto] bg-[#131312] sm:mr-120">
				{/*<Timer
					side={color === "w" ? "b" : "w"}
					blackDisplayTime={blackDisplay!}
					whiteDisplayTime={whiteDisplay!}
					currentTurn={currentTurn!}
					playerName={"Opponent"}
				/>*/}
				<ChessBoard chessboardOptions={chessboardOptions} />
				{/*<Timer
					currentTurn={currentTurn!}
					side={color}
					blackDisplayTime={blackDisplay!}
					whiteDisplayTime={whiteDisplay!}
					playerName={user?.name || "You"}
				/>*/}
			</div>
			<SideBar opponent={opponent} />
		</>
	);
}
