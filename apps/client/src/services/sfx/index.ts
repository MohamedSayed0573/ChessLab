import type { Chess } from "chess.js";

const sounds = {
	move: new Audio("/sounds/standard/Move.mp3"),
	check: new Audio("/sounds/standard/Check.mp3"),
	capture: new Audio("/sounds/standard/Capture.mp3"),
	checkmate: new Audio("/sounds/standard/Game-End.mp3"),
	castle: new Audio("/sounds/standard/Castle.mp3"),
	promotion: new Audio("/sounds/standard/Promote.mp3"),
	defeat: new Audio("/sounds/standard/GenericNotify.mp3"),
	draw: new Audio("/sounds/standard/GenericNotify.mp3"),
};

function playSound(sound: keyof typeof sounds) {
	const audio = sounds[sound];

	audio.currentTime = 0;
	audio.play();
}

export function playMoveSound(chess: Chess) {
	if (chess.isGameOver()) {
		if (chess.isCheckmate()) playSound("checkmate");
		else if (chess.isDraw()) playSound("draw");
		else playSound("defeat");
		return;
	}

	const moves = chess.history({ verbose: true });
	if (moves.length > 0) {
		const lastMove = moves[moves.length - 1];
		console.log(lastMove);
		if (lastMove?.san.endsWith("+")) {
			console.log(lastMove.san);
			playSound("check");
		} else if (lastMove?.isCapture()) {
			playSound("capture");
		} else if (lastMove?.isKingsideCastle() || lastMove?.isQueensideCastle()) {
			playSound("castle");
		} else if (lastMove?.isPromotion()) {
			playSound("promotion");
		} else {
			playSound("move");
		}
	}
}
