import ChessBoard from "@components/chessBoard";
import { Timer } from "@components/Timer";
import SideBar from "@components/chessSidebar";
import { useComputerGame } from "@hooks/game/useComputerGame";
import { useState } from "react";
import type { DifficultyKey } from "@constants/stockfish";

export default function ComputerChessBoard() {
	const [difficulty, setDifficulty] = useState<DifficultyKey>("beginner");
	const { turn, side, timeMs, gameOverInfo, chessboardOptions } = useComputerGame({ difficulty });

	return (
		<div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto] bg-[#131312] sm:mr-120">
			<Timer side={side === "w" ? "b" : "w"} currentTurn={turn} playerName="Stockfish" />
			<ChessBoard chessboardOptions={chessboardOptions} />
			<Timer currentTurn={turn} side={side} displayTime={timeMs} playerName="Player" />
			<SideBar
				opponent={"Stockfish"}
				gameState={gameOverInfo}
				setDifficulty={setDifficulty}
				difficulty={difficulty}
			/>
		</div>
	);
}
