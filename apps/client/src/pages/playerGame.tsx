import { useParams } from "react-router";
import ChessBoard from "@components/chessBoard";
import SideBar from "@components/chessSidebar";
import { useChessGame } from "@hooks/game/useChessGame";
import { Timer } from "@components/Timer";
import useUser from "@hooks/useUser";

export default function PlayerGame() {
	const { roomId: gameId } = useParams();
	const { color, opponentId, gameOverInfo, blackTimeMs, whiteTimeMs, turn, chessboardOptions } =
		useChessGame(gameId);
	const { user } = useUser();

	return (
		<>
			<div className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto] bg-[#131312] sm:mr-120">
				<Timer
					side={color === "w" ? "b" : "w"}
					displayTime={color === "w" ? blackTimeMs : whiteTimeMs}
					currentTurn={turn}
					playerName={"Opponent"}
				/>
				<ChessBoard chessboardOptions={chessboardOptions} />
				<Timer
					currentTurn={turn}
					side={color}
					displayTime={color === "w" ? whiteTimeMs : blackTimeMs}
					playerName={user?.name || "You"}
				/>
			</div>
			<SideBar opponent={opponentId} gameState={gameOverInfo} />
		</>
	);
}
