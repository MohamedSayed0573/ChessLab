import { useNavigate } from "react-router";
import { routes } from "../routes";
import type React from "react";
import { useState } from "react";
import useCreateGame from "../hooks/useCreateGame";
import useJoinGame from "../hooks/useJoinGame";
import TrendingUpIcon from "../icons/TrendingUpIcon";
import RookIcon from "../icons/RookIcon";
import RocketIcon from "../icons/RocketIcon";

export default function PlayPage() {
	const navigate = useNavigate();
	const { createGame, errorMessage, clearMessage } = useCreateGame();
	return (
		<div className="font-hanken flex h-screen flex-col gap-12 bg-[#151310] p-12">
			<HeroSection>
				<Hero />
				<BoardCard />
			</HeroSection>

			<CardsSection>
				<FeatureCard
					label="Play a Friend"
					icon="group"
					description="Challenge your friends to a friendly match or a
							competitive rated series."
					btnLabel="Create a new Room"
					btnOnClick={createGame}
				/>
				<FeatureCard
					label="Play Computer"
					icon="smart_toy"
					description="Play against various engine levels
							from beginner to grandmaster."
					btnLabel="Play against Computer"
					btnOnClick={() => navigate(routes.play.computer)}
				/>
				<JoinRoomCard />
			</CardsSection>
			{errorMessage && (
				<ErrorMessage
					errorMessage={errorMessage}
					clearMessage={clearMessage}
				/>
			)}
		</div>
	);
}

function CardsSection({ children }: { children: React.ReactNode }) {
	return <div className="grid grid-cols-3 gap-6">{children}</div>;
}

function HeroSection({ children }: { children: React.ReactNode }) {
	return <div className="flex gap-4">{children}</div>;
}

function FeatureCard({
	label,
	description,
	icon,
	btnOnClick,
	btnLabel,
}: {
	label: string;
	description: string;
	icon: string;
	btnOnClick: () => void;
	btnLabel: string;
}) {
	return (
		<div className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-[#3C3934]/40 p-6 pb-0 backdrop-blur-md">
			<span className="material-symbols-outlined self-start rounded-xl bg-[#22511C]/30 p-3">
				{icon}
			</span>
			<span className="mt-2 text-[16px] font-semibold text-[#E8E1DC]">
				{label}
			</span>
			<span className="text-[16px] text-[#C2C9B6]">{description}</span>
			<button
				className="self-start rounded pt-2 text-sm font-bold text-[#9FD491] hover:cursor-pointer"
				type="button"
				onClick={btnOnClick}
			>
				{btnLabel}
			</button>
		</div>
	);
}

function JoinRoomCard() {
	const [roomId, setRoomId] = useState<string>("");
	const { errorMessage, joinGame, clearMessage } = useJoinGame();

	return (
		<div className="flex flex-col gap-3 rounded-2xl border border-[#42493A]/30 bg-[#2C2927] p-6">
			<span className="text-base text-[#E8E1DC]">Join Private Room</span>
			<div className="relative rounded-lg bg-[#151310]">
				<input
					type="text"
					placeholder="Enter Room Code"
					className="p-4 font-mono text-base tracking-wider text-[#6B7280] uppercase"
					onChange={(e) => setRoomId(e.target.value)}
				/>
				<span className="material-symbols-outlined absolute top-2 right-2 text-[#C2C9B6]/40">
					key
				</span>
			</div>
			<button
				className="cursor-pointer rounded-xl bg-[#373431] py-4"
				onClick={() => {
					joinGame(roomId);
				}}
			>
				<span className="text-base font-bold text-[#E8E1DC]">
					Join Game
				</span>
			</button>
			{errorMessage && (
				<ErrorMessage
					clearMessage={clearMessage}
					errorMessage={errorMessage}
				/>
			)}
		</div>
	);
}

function Hero() {
	const { createGame, errorMessage, clearMessage } = useCreateGame();
	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-[48px] font-extrabold text-[#E8E1DC]">
				Master the Board, Define Your Strategy.
			</h1>
			<p className="text-lg text-[#C2C9B6]">
				Experience the world's most advanced chess arena. Compete
				against grandmasters or hone your skills against precision-
				tuned neural engines.
			</p>
			<button
				onClick={() => createGame()}
				className="inline-flex cursor-pointer gap-2 self-start rounded-lg bg-[#81B64C] px-8 py-4 font-bold text-[#244400]"
			>
				<RocketIcon />
				<span>Play Online</span>
			</button>
			{errorMessage && (
				<ErrorMessage
					clearMessage={clearMessage}
					errorMessage={errorMessage}
				/>
			)}
		</div>
	);
}

function BoardCard() {
	return (
		<div className="relative aspect-square h-80 w-80 rounded-xl bg-[#403D38] p-2">
			<div className="grid h-full w-full grid-cols-4 grid-rows-4 gap-1 rounded-lg bg-zinc-800 p-2">
				<div className="rounded bg-[#769656]/20"></div>
				<div className="rounded bg-[#EEEED2]/10"></div>
				<div className="rounded bg-[#769656]/20"></div>
				<div className="rounded bg-[#EEEED2]/10"></div>

				<div className="rounded bg-[#EEEED2]/10"></div>
				<div className="flex items-center justify-center rounded bg-[#769656]/20">
					<RookIcon color="#9FD668" />
				</div>
				<div className="rounded bg-[#EEEED2]/10"></div>
				<div className="rounded bg-[#769656]/20"></div>

				<div className="rounded bg-[#769656]/20"></div>
				<div className="rounded bg-[#EEEED2]/10"></div>
				<div className="flex items-center justify-center rounded bg-[#769656]/20">
					<RookIcon color="#C2C9B6" />
				</div>
				<div className="rounded bg-[#EEEED2]/10"></div>

				<div className="rounded bg-[#EEEED2]/10"></div>
				<div className="rounded bg-[#769656]/20"></div>
				<div className="rounded bg-[#EEEED2]/10"></div>
				<div className="rounded bg-[#769656]/20"></div>
			</div>
			<div className="absolute -bottom-10 -left-10 flex items-center gap-3 rounded-xl bg-white/2 p-4 backdrop-blur-sm">
				<div className="rounded bg-[#9FD668]/20 p-3">
					<TrendingUpIcon />
				</div>
				<div className="flex flex-col gap-2">
					<span className="text-xs font-medium text-[#C2C9B6]">
						Daily Win Rate
					</span>
					<span className="text-lg font-bold text-[#E8E1DC]">
						53.6%
					</span>
				</div>
			</div>
		</div>
	);
}

function ErrorMessage({
	errorMessage,
	clearMessage,
}: {
	errorMessage: string | undefined;
	clearMessage: () => void;
}) {
	if (!errorMessage) return;
	return (
		<div className="relative rounded-xl bg-amber-900 px-3 py-2">
			{errorMessage}
			<button
				className="material-symbols-outlined absolute top-1 right-1 cursor-pointer"
				onClick={clearMessage}
			>
				close
			</button>
		</div>
	);
}
