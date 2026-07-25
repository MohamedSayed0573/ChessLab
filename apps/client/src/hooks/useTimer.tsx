import type { GameOverInfo } from "@chesslab/shared/types";
import { useEffect, useState } from "react";

export default function useTimer({
	turn,
	gameOverInfo,
}: {
	turn: "w" | "b";
	gameOverInfo: GameOverInfo | undefined;
}) {
	const [whiteDisplayTime, setWhiteDisplayTime] = useState(600_000);
	const [blackDisplayTime, setBlackDisplayTime] = useState(600_000);

	useEffect(() => {
		if (gameOverInfo) return;
		let interval: NodeJS.Timeout | null = null;

		if (turn === "w") {
			interval = setInterval(() => {
				setWhiteDisplayTime((prev) => Math.max(0, prev - 1000));
			}, 1000);
		} else {
			interval = setInterval(() => {
				setBlackDisplayTime((prev) => Math.max(0, prev - 1000));
			}, 1000);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [turn, gameOverInfo]);

	return { whiteDisplayTime, blackDisplayTime };
}
