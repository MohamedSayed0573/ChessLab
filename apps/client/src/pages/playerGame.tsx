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
import ChessBoard from "@components/chessBoard";
import SideBar from "@components/chessSidebar";
import { useSocket } from "@hooks/useSocket";

export default function PlayerGame() {
	const { roomId: gameId } = useParams();
	const { socket } = useSocket();

	const [chessGame] = useState(new Chess());
	const [chessPosition, setChessPosition] = useState(() => chessGame.fen());
	const [gameOverInfo, setGameOverInfo] = useState<GameStateEvent | undefined>();
	const [opponentId, setOpponentId] = useState<string | undefined>();
	const [color, setColor] = useState<PlayerColor | undefined>();
	const [, setTurn] = useState<PlayerColor | undefined>();
	const [isGameStarted, setGameStarted] = useState(false);

	useEffect(() => {
		if (!gameId) return;

		function handleMove({ fen, turn }: MoveMadeEvent) {
			chessGame.load(fen);
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
		socket.emit("game:sync", (res: GameSync) => {
			if (!res.ok) {
				console.error("game:sync failed:", res.error);
				return;
			}
			setColor(res.color);
			setOpponentId(res.opponentId);
			chessGame.load(res.fen);
			setChessPosition(res.fen);
			setTurn(res.turn);
			if (res.opponentId) {
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
	}, [gameId, socket, chessGame]);

	function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
		if (!targetSquare || gameOverInfo?.gameOver || !isGameStarted || !color) {
			return false;
		}

		const chess = chessGame;

		// Local turn check — avoid emitting when it's not our turn
		if (chess.turn() !== color) {
			return false;
		}

		const previousFen = chess.fen();

		try {
			const move = chess.move({
				from: sourceSquare,
				to: targetSquare,
				promotion: "q",
			});
			if (!move) return false;
		} catch {
			// chess.js throws on illegal moves
			return false;
		}

		// Optimistic UI: show the move immediately
		setChessPosition(chess.fen());
		setTurn(chess.turn());

		socket.emit(
			"game:move",
			{
				promotion: "q",
				from: sourceSquare,
				to: targetSquare,
			},
			(data: GameMoveAck) => {
				if (data.ok) {
					chessGame.load(data.fen);
					setChessPosition(data.fen);
					setTurn(data.turn);
				} else {
					chess.load(previousFen);
					setChessPosition(previousFen);
					setTurn(chess.turn());
					console.error("game:move rejected:", data.error);
				}
			},
		);

		return true;
	}

	const chessboardOptions: ChessboardOptions = {
		position: chessPosition,
		onPieceDrop,
		// react-chessboard uses `#${id}-square-…` in querySelector; CSS ids
		// cannot start with a digit, so raw UUIDs (e.g. 94632a9e-…) throw.
		id: gameId ? `board-${gameId}` : "board",
		boardOrientation: color === "w" ? "white" : "black",
	};

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
			<SideBar opponent={opponentId} gameState={gameOverInfo} />
		</>
	);
}
