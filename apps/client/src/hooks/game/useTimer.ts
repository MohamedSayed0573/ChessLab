import type { GameStateEvent, TimeInfo } from "@chesslab/shared/types";
import { useEffect, useState } from "react";

export const START_TIME_MS = 60 * 10 * 1000; // 10 minutes, 600_000 ms
export default function useTimer({
	turn,
	gameOverInfo,
	timeInfo,
}: {
	turn: "w" | "b";
	gameOverInfo: GameStateEvent | undefined;
	timeInfo: TimeInfo | undefined;
}) {
	const [whiteTimeMs, setWhiteTimeMs] = useState(START_TIME_MS);
	const [blackTimeMs, setBlackTimeMs] = useState(START_TIME_MS);

	useEffect(() => {
		if (gameOverInfo?.gameOver || !timeInfo) return;

		const interval = setInterval(() => {
			const elapsed = timeInfo.lastMoveTime != null ? Date.now() - timeInfo.lastMoveTime : 0;

			setWhiteTimeMs(
				turn === "w" ? Math.max(0, timeInfo.whiteTimeMs - elapsed) : timeInfo.whiteTimeMs,
			);
			setBlackTimeMs(
				turn === "b" ? Math.max(0, timeInfo.blackTimeMs - elapsed) : timeInfo.blackTimeMs,
			);
		}, 250);

		return () => clearInterval(interval);
	}, [turn, gameOverInfo, timeInfo]);

	return {
		whiteTimeMs,
		blackTimeMs,
	};
}
