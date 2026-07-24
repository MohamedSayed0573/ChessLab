import {
	type ChessboardOptions,
	type PieceDropHandlerArgs,
} from "react-chessboard";
import { Chess } from "chess.js";
import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useParams } from "react-router";
import type { GameOverInfo, JoinGameRes } from "@chesslab/shared/types";
import ChessBoard from "../components/chessBoard";
import SideBar from "../components/chessSidebar";
import { Timer } from "../components/Timer";
import useUser from "../hooks/useUser";

export default function PlayerGame() {
	const { roomId } = useParams();

	// track the current position of the chess game in state to trigger a re-render of the chessboard
	const [chessPosition, setChessPosition] = useState(() => new Chess().fen());
	const [color, setColor] = useState<"w" | "b">("w");
	const [gameOverInfo, setGameOverInfo] = useState<
		GameOverInfo | undefined
	>();
	const { user } = useUser();

	const [whiteTime, setWhiteTime] = useState<number>();
	const [blackTime, setBlackTime] = useState<number>();
	const [currentTurn, setCurrentTurn] = useState<"w" | "b">(color);
	const [lastMoveTime, setLastMoveTime] = useState<number>();
	const [whiteDisplay, setWhiteDisplay] = useState<number>(600_000);
	const [blackDisplay, setBlackDisplay] = useState<number>(600_000);

	const [gameHistory, setGameHistory] = useState<string[]>();

	useEffect(() => {
		if (!roomId) return;

		function handleMove(fen: string) {
			setChessPosition(fen);
			socket.emit("getHistory", (res: string[]) => {
				setGameHistory(res);
			});
		}

		function joinGame() {
			socket.emit("joinGame", roomId, (res: JoinGameRes) => {
				if (!res.success) return;
				setColor(res.color);
			});
		}

		function handleGameOver(gameOverInfo: GameOverInfo) {
			setGameOverInfo(gameOverInfo);
		}

		socket.on("moveRes", handleMove);
		socket.on("gameOver", handleGameOver);
		socket.on("connect", joinGame);

		type GameStateType = {
			whiteTimeMs: number;
			blackTimeMs: number;
			currentTurn: "w" | "b";
			lastMoveTime: number;
		};

		function handleGameState({
			whiteTimeMs,
			blackTimeMs,
			currentTurn,
			lastMoveTime,
		}: GameStateType) {
			setWhiteTime(whiteTimeMs);
			setBlackTime(blackTimeMs);

			setCurrentTurn(currentTurn);
			setLastMoveTime(lastMoveTime);

			setWhiteDisplay(whiteTimeMs);
			setBlackDisplay(blackTimeMs);
		}

		socket.on("gameState", handleGameState);

		if (socket.connected) {
			joinGame();
		} else {
			socket.connect();
		}

		return () => {
			socket.off("moveRes", handleMove);
			socket.off("gameOver", handleGameOver);
			socket.off("connect", joinGame);
			socket.off("gameState", handleGameState);
		};
	}, [roomId]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (gameOverInfo?.winner) {
				clearInterval(interval);
				return;
			}
			if (!currentTurn || !lastMoveTime) return;
			const elapsed = Date.now() - lastMoveTime!;

			if (currentTurn === "w") {
				setWhiteDisplay(whiteTime! - elapsed);
			} else {
				setBlackDisplay(blackTime! - elapsed);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [currentTurn, lastMoveTime, whiteTime, blackTime, gameOverInfo?.winner]);

	// handle piece drop
	function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
		// type narrow targetSquare potentially being null (e.g. if dropped off board)
		if (!targetSquare || gameOverInfo?.winner) {
			return false;
		}

		socket.emit("move", {
			promotion: "q",
			from: sourceSquare,
			to: targetSquare,
		});

		return true;
	}

	// set the chessboard options
	const chessboardOptions: ChessboardOptions = {
		position: chessPosition,
		onPieceDrop,
		id: roomId!,
		boardOrientation: color === "w" ? "white" : "black",
	};

	// render the chessboard
	return (
		<>
			<div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto] bg-[#131312] sm:mr-120">
				<Timer
					side={color === "w" ? "b" : "w"}
					blackDisplayTime={blackDisplay!}
					whiteDisplayTime={whiteDisplay!}
					currentTurn={currentTurn!}
					playerName={"Opponent"}
				/>
				<ChessBoard chessboardOptions={chessboardOptions} />
				<Timer
					currentTurn={currentTurn!}
					side={color}
					blackDisplayTime={blackDisplay!}
					whiteDisplayTime={whiteDisplay!}
					playerName={user?.name || "You"}
				/>
			</div>
			<SideBar gameOverInfo={gameOverInfo} gameHistory={gameHistory} />
		</>
	);
}
