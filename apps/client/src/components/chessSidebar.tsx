import type { GameStateEvent } from "@chesslab/shared/types";

export default function SideBar({
	opponent,
	gameState,
}: {
	opponent: string | undefined;
	gameState: GameStateEvent | undefined;
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
		</div>
	);
}
