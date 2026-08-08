import type { GameStateEvent } from "@chesslab/shared/types";
import type { DifficultyKey } from "@constants/stockfish";
import { difficulties } from "@constants/stockfish";

export default function SideBar({
	opponent,
	gameState,
	setDifficulty,
	difficulty,
}: {
	opponent: string | undefined;
	gameState: GameStateEvent | undefined;
	setDifficulty: React.Dispatch<React.SetStateAction<DifficultyKey>>;
	difficulty: DifficultyKey;
}) {
	return (
		<div className="fixed top-0 right-0 h-full w-120 border-l border-[#424A35] bg-[#1C1C1A] p-4">
			<div>
				{opponent && (
					<div>
						<span>Your Opponent is {opponent}</span>
					</div>
				)}
				{!opponent && (
					<div>
						<div>Waiting for opponent...</div>
						<div>Ask Them to Join using the link {location.href}</div>
					</div>
				)}
				{gameState && (
					<div>
						<span>{gameState?.reason}</span>
					</div>
				)}
			</div>
			<div>
				<select
					value={difficulty}
					onChange={(e) => setDifficulty(e.target.value as DifficultyKey)}
				>
					{Object.entries(difficulties).map(([key]) => (
						<option key={key} value={key}>
							{key}
						</option>
					))}
				</select>
			</div>
		</div>
	);
}
