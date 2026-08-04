import { type ChessboardOptions, type PieceDropHandlerArgs } from "react-chessboard";
import { Chess } from "chess.js";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type {
	GameStateEvent,
	GameMoveAck,
	MoveMadeEvent,
	PlayerJoinedEvent,
	PlayerColor,
	GameSync,
} from "@chesslab/shared/types";
import ChessBoard from "../components/chessBoard";
import SideBar from "../components/chessSidebar";
import { useSocket } from "../hooks/useSocket";

export default function PlayerGame() {
	const { roomId: gameId } = useParams();
	const { socket } = useSocket();

	const [chessPosition, setChessPosition] = useState(() => new Chess().fen());
	const [gameOverInfo, setGameOverInfo] = useState<GameStateEvent | undefined>();
	const [opponentId, setOpponentId] = useState<string | undefined>();
	const [color, setColor] = useState<PlayerColor | undefined>();
	const [, setTurn] = useState<PlayerColor | undefined>();
	const [isGameStarted, setGameStarted] = useState(false);

	useEffect(() => {
		if (!gameId) return;

		function handleMove({ fen, turn }: MoveMadeEvent) {
			setChessPosition(fen);
			setTurn(turn);
		}

		function handleGameOver(gameOverInfo: GameStateEvent) {
			setGameOverInfo(gameOverInfo);
		}

		function handleOpponentJoined({ opponentId }: PlayerJoinedEvent) {
			setOpponentId(opponentId);
		}

		function handleGameStarted() {
			setGameStarted(true);
		}

		socket.on("game:game-over", handleGameOver);
		socket.on("game:game-move", handleMove);
		socket.on("game:move-made", handleMove);
		socket.on("game:game-started", handleGameStarted);
		socket.on("game:player-joined", handleOpponentJoined);
		socket.emit("game:sync", ({ color, opponentId, fen, turn }: GameSync) => {
			setColor(color);
			setOpponentId(opponentId);
			setChessPosition(fen);
			setTurn(turn);
			if (opponentId) {
				setGameStarted(true);
			}
		});

		return () => {
			socket.off("game:move-made", handleMove);
			socket.off("game:game-move", handleMove);
			socket.off("game:game-over", handleGameOver);
			socket.off("game:game-started", handleGameStarted);
			socket.off("game:player-joined", handleOpponentJoined);
		};
	}, [gameId, socket]);

	// handle piece drop
	function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
		// type narrow targetSquare potentially being null (e.g. if dropped off board)
		if (!targetSquare || gameOverInfo?.gameOver || !isGameStarted) {
			return false;
		}

		socket.emit(
			"game:move",
			{
				promotion: "q",
				from: sourceSquare,
				to: targetSquare,
			},
			(data: GameMoveAck) => {
				if (data.ok) {
					setChessPosition(data.fen);
					setTurn(data.turn);
				} else {
					alert(data.error);
				}
			},
		);

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
			<SideBar opponent={opponentId} />
		</>
	);
}
