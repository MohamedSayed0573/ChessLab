import { socket } from "../socket";

export default function SideBar({ opponent }: { opponent: string | undefined }) {
	return (
		<div className="fixed top-0 right-0 hidden h-full w-120 border-l border-[#424A35] bg-[#1C1C1A] p-4 sm:block">
			<div>
				{opponent && (
					<div>
						<span>Your Opponent is {opponent}</span>
						<button
							onClick={() => {
								socket.emit("game:start");
							}}
						>
							Start the Game
						</button>
					</div>
				)}
				{!opponent && (
					<div>
						<div>Waiting for opponent...</div>
						<div>Ask Them to Join using the link {location.href}</div>
					</div>
				)}
			</div>
		</div>
	);
}
