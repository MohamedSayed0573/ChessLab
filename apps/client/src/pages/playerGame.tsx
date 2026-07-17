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
import { cn } from "../utils/cn";

export default function PlayerGame() {
	const { roomId } = useParams();

	// track the current position of the chess game in state to trigger a re-render of the chessboard
	const [chessPosition, setChessPosition] = useState(() => new Chess().fen());
	const [color, setColor] = useState<"w" | "b">("w");
	const [gameOverInfo, setGameOverInfo] = useState<
		GameOverInfo | undefined
	>();

	const [whiteTime, setWhiteTime] = useState<number>();
	const [blackTime, setBlackTime] = useState<number>();
	const [currentTurn, setCurrentTurn] = useState<"w" | "b">(color);
	const [lastMoveTime, setLastMoveTime] = useState<number>();
	const [whiteDisplay, setWhiteDisplay] = useState<number>(600_000);
	const [blackDisplay, setBlackDisplay] = useState<number>(600_000);

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
			<div className="mr-120 grid h-full grid-rows-[auto_minmax(0,1fr)_auto] bg-[#131312]">
				<Timer
					side={color === "w" ? "b" : "w"}
					blackDisplayTime={blackDisplay!}
					whiteDisplayTime={whiteDisplay!}
					currentTurn={currentTurn!}
				/>
				<ChessBoard chessboardOptions={chessboardOptions} />
				<Timer
					currentTurn={currentTurn!}
					side={color}
					blackDisplayTime={blackDisplay!}
					whiteDisplayTime={whiteDisplay!}
				/>
			</div>
			<SideBar gameOverInfo={gameOverInfo} />
		</>
	);
}

function SideBar({ gameOverInfo }: { gameOverInfo: GameOverInfo | undefined }) {
	return (
		<div className="fixed top-0 right-0 h-full w-120 border-l border-[#424A35] bg-[#1C1C1A] p-4">
			{gameOverInfo && (
				<>
					<div>
						{gameOverInfo.winner === "w"
							? "White Won!"
							: gameOverInfo.winner === "b"
								? "Black Won!"
								: "Draw!"}
					</div>
					<div>{gameOverInfo.reason}</div>
				</>
			)}
		</div>
	);
}

type TimerType = {
	side: "w" | "b";
	whiteDisplayTime: number;
	blackDisplayTime: number;
	currentTurn: "w" | "b";
};
function Timer({
	side,
	blackDisplayTime,
	whiteDisplayTime,
	currentTurn,
}: TimerType) {
	const isActive = side === currentTurn;
	const displayTime = side === "w" ? whiteDisplayTime : blackDisplayTime;
	return (
		<div className="m-2 flex items-center justify-between rounded-lg border border-[#424A35]/30 bg-[#20201E] p-3">
			<div className="flex items-center gap-2">
				<span className="material-symbols-outlined">person</span>
				<span className="text-lg text-[#E5E2DE]">Random Dude</span>
			</div>

			<div
				className={cn(
					"rounded border border-[#424A35] bg-[#2A2A28] px-4 py-2 text-[#E5E2DE]",
					{ "bg-[#8cdd12] text-[#203600]": isActive },
				)}
			>
				<span className={cn("font-mono text-lg font-semibold")}>
					{formatTime(displayTime)}
				</span>
			</div>
		</div>
	);
}

function formatTime(ms: number) {
	const totalSeconds = Math.max(0, Math.floor(ms / 1000));
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
