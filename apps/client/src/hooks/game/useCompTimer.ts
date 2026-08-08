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
		if (isGameOver || turn !== side) return;

		let previousTime = Date.now();

		const interval = setInterval(() => {
			const now = Date.now();
			const elapsed = now - previousTime;
			previousTime = now;

			setTimeMs((prev) => Math.max(0, prev - elapsed));
		}, 100);

		return () => clearInterval(interval);
	}, [side, turn, isGameOver]);

	return { timeMs, isTimeUp: timeMs <= 0 };
}
