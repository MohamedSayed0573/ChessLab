import type { GameOverInfo } from "@chesslab/shared/types";

export default function SideBar({
	gameHistory,
	gameOverInfo,
}: {
	gameHistory: string[] | undefined;
	gameOverInfo: GameOverInfo | undefined;
}) {
	return (
		<div className="fixed top-0 right-0 hidden h-full w-120 border-l border-[#424A35] bg-[#1C1C1A] p-4 sm:block">
			{gameOverInfo && (
				<div className="mb-4 rounded-lg border border-[#424A35] bg-[#20201E] p-4">
					<h2 className="mb-2 text-lg font-semibold text-[#E5E2DE]">
						Game Over
					</h2>
					<p className="text-[#E5E2DE]">
						Reason: {gameOverInfo.reason}
					</p>
					<p className="text-[#E5E2DE]">
						Winner:{" "}
						{gameOverInfo.winner === "d"
							? "Draw"
							: gameOverInfo.winner === "w"
								? "White"
								: "Black"}
					</p>
				</div>
			)}

			{gameHistory && (
				<table className="w-full table-fixed text-sm">
					<tbody>
						{Array(Math.ceil(gameHistory.length / 2))
							.fill(undefined)
							.map((_, row) => (
								<tr
									key={row}
									className="border-b border-zinc-800 hover:bg-zinc-800/50"
								>
									<td className="w-10 py-1 text-center text-zinc-500">
										{row + 1}.
									</td>

									<td className="px-3 py-1 font-medium">
										{gameHistory[row * 2]}
									</td>

									<td className="px-3 py-1 font-medium">
										{gameHistory[row * 2 + 1] ?? ""}
									</td>
								</tr>
							))}
					</tbody>
				</table>
			)}
		</div>
	);
}
