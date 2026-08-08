import { useEffect, useState } from "react";

export const START_TIME_MS = 60 * 10 * 1000; // 10 minutes, 600_000 ms

interface UseCompTimerProps {
	turn: "w" | "b";
	side: "w" | "b";
	isGameOver: boolean;
}

export function useCompTimer({ turn, side, isGameOver }: UseCompTimerProps) {
	const [timeMs, setTimeMs] = useState(START_TIME_MS);
	useEffect(() => {
		if (isGameOver) return;
		const timer = setInterval(() => {
			if (turn === side) {
				setTimeMs((prev) => prev - 250);
			}
		}, 250);

		return () => clearInterval(timer);
	}, [side, turn, isGameOver]);

	return { timeMs, isTimeUp: timeMs <= 0 };
}
