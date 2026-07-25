import {
	type ChessboardOptions,
	type PieceDropHandlerArgs,
} from "react-chessboard";
import { useState } from "react";
import { Chess } from "chess.js";
import ChessBoard from "../components/chessBoard";
import useStockfish from "../hooks/useStockfish";
import useTimer from "../hooks/useTimer";
import { Timer } from "../components/Timer";
import SideBar from "../components/chessSidebar";
import type { GameOverInfo } from "@chesslab/shared/types";

export default function ComputerChessBoard() {
	const [chessGame] = useState(() => new Chess());
	const [chessPosition, setChessPosition] = useState(() => new Chess().fen());
	const [turn, setTurn] = useState<"w" | "b">("w");
	const [gameHistory, setGameHistory] = useState<string[]>([]);
	const gameOverInfo = getGameOverInfo(chessGame);
	const [side] = useState<"w" | "b">(() => (Math.random() < 0.5 ? "w" : "b"));

	const { whiteDisplayTime, blackDisplayTime } = useTimer({
		turn,
		gameOverInfo,
	});

	useStockfish({
		chessGame,
		turn,
		stockfishSide: side === "w" ? "b" : "w",
		onMove: () => {
			setChessPosition(chessGame.fen());
			setTurn(chessGame.turn());
			setGameHistory(chessGame.history());
		},
	});

	function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
		if (chessGame.isGameOver()) return false;

		if (!targetSquare) {
			return false;
		}

		try {
			const move = chessGame.move({
				from: sourceSquare,
				to: targetSquare,
				promotion: "q",
			});

			if (!move) return false;

			setChessPosition(chessGame.fen());
			setTurn(chessGame.turn());
			setGameHistory(chessGame.history());

			return true;
		} catch {
			return false;
		}
	}

	const chessboardOptions: ChessboardOptions = {
		position: chessPosition!,
		onPieceDrop,
		boardOrientation: side === "w" ? "white" : "black",
	};

	return (
		<div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto] bg-[#131312] sm:mr-120">
			<Timer
				side={side === "w" ? "b" : "w"}
				blackDisplayTime={blackDisplayTime}
				whiteDisplayTime={whiteDisplayTime}
				currentTurn={turn}
				playerName="Stockfish"
			/>
			<ChessBoard chessboardOptions={chessboardOptions} />
			<Timer
				currentTurn={turn}
				side={side}
				blackDisplayTime={blackDisplayTime}
				whiteDisplayTime={whiteDisplayTime}
				playerName="Player"
			/>
			<SideBar gameHistory={gameHistory} gameOverInfo={gameOverInfo} />
		</div>
	);
}

function getGameOverInfo(chess: Chess): GameOverInfo | undefined {
	if (!chess.isGameOver()) return undefined;

	if (chess.isCheckmate()) {
		return {
			reason: "Checkmate",
			winner: chess.turn() === "w" ? "b" : "w",
		};
	} else if (chess.isStalemate()) {
		return { reason: "Stalemate", winner: "d" };
	} else if (chess.isInsufficientMaterial()) {
		return { reason: "Insufficient Material", winner: "d" };
	} else if (chess.isThreefoldRepetition()) {
		return { reason: "Threefold Repetition", winner: "d" };
	} else if (chess.isDrawByFiftyMoves()) {
		return { reason: "Fifty-Move Rule", winner: "d" };
	} else {
		return { reason: "Draw", winner: "d" };
	}
}
