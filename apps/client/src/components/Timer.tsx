import { cn } from "../utils/cn";

interface TimerType {
	side: "w" | "b";
	whiteDisplayTime: number;
	blackDisplayTime: number;
	currentTurn: "w" | "b";
	playerName: string | undefined;
}

export function Timer({
	side,
	blackDisplayTime,
	whiteDisplayTime,
	currentTurn,
	playerName = "Random Player",
}: TimerType) {
	const isActive = side === currentTurn;
	const displayTime = side === "w" ? whiteDisplayTime : blackDisplayTime;
	return (
		<div className="m-2 flex items-center justify-between rounded-lg border border-[#424A35]/30 bg-[#20201E] p-3">
			<div className="flex items-center gap-2">
				<span className="material-symbols-outlined">person</span>
				<span className="text-lg text-[#E5E2DE]">{playerName}</span>
			</div>

			<div
				className={cn(
					"rounded border border-[#424A35] bg-[#2A2A28] px-4 py-2 text-[#E5E2DE]",
					{ "bg-[#8cdd12] text-[#203600]": isActive },
				)}
			>
				<span className={cn("font-mono text-lg font-semibold")}>
					{formatTime(displayTime)}
				</span>
			</div>
		</div>
	);
}

function formatTime(ms: number) {
	const totalSeconds = Math.max(0, Math.floor(ms / 1000));
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
