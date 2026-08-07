import { type ChessboardOptions } from "react-chessboard";
import { useParams } from "react-router";
import ChessBoard from "@components/chessBoard";
import SideBar from "@components/chessSidebar";
import { useChessGame } from "@hooks/useChessGame";

export default function PlayerGame() {
	const { roomId: gameId } = useParams();
	const { onPieceDrop, chessPosition, color, opponentId, gameOverInfo } = useChessGame(gameId);

	const chessboardOptions: ChessboardOptions = {
		position: chessPosition,
		onPieceDrop,
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
