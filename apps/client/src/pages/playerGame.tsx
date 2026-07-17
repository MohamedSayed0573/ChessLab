import {
	type ChessboardOptions,
	type PieceDropHandlerArgs,
} from "react-chessboard";
import { Chess } from "chess.js";
import { useEffect, useMemo, useState } from "react";
import { socket } from "../socket";
import { useParams } from "react-router";
import type { JoinGameRes } from "@chesslab/shared/types";
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
	function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
		// type narrow targetSquare potentially being null (e.g. if dropped off board)
		if (!targetSquare || gameResult) {
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
		boardOrientation: color,
	};

	// render the chessboard
	return (
		<>
			<Layout className="mr-64 grid grid-rows-[auto_minmax(0,1fr)_auto] bg-[#131312]">
				<Timer />
				<ChessBoard chessboardOptions={chessboardOptions} />
				<Timer />
			</Layout>
			<SideBar />
		</>
	);
}

function SideBar() {
	return (
		<div className="fixed top-0 right-0 h-full w-64 border-l border-[#424A35] bg-[#1C1C1A] p-4"></div>
	);
}

function Timer() {
	return (
		<div className="m-2 flex items-center justify-between rounded-lg border border-[#424A35]/30 bg-[#20201E] p-3">
			<div className="flex items-center gap-2">
				<span className="material-symbols-outlined">person</span>
				<span className="text-lg text-[#E5E2DE]">Random Dude</span>
			</div>
			<div className="rounded border border-[#424A35] bg-[#2A2A28] px-4 py-2">
				<span className="font-mono text-lg font-medium text-[#E5E2DE]">
					10:00
				</span>
			</div>
		</div>
	);
}
