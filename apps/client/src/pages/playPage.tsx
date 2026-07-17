import { useNavigate } from "react-router";
import { routes } from "../routes";
import type React from "react";
import { useState } from "react";
import useCreateGame from "../hooks/useCreateGame";
import useJoinGame from "../hooks/useJoinGame";

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

function RookIcon({ color }: { color: string }) {
	return (
		<svg
			width="27"
			height="30"
			viewBox="0 0 27 30"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M3 27H24V24H3V27ZM7.95 21H19.05L18.1875 15H8.8125L7.95 21ZM0 30V24C0 23.175 0.29375 22.4688 0.88125 21.8813C1.46875 21.2938 2.175 21 3 21H4.95L5.775 15H1.5V12H25.5V15H21.225L22.05 21H24C24.825 21 25.5312 21.2938 26.1187 21.8813C26.7062 22.4688 27 23.175 27 24V30H0ZM5.6625 12L3 0C3.825 0.625 4.675 1.2125 5.55 1.7625C6.425 2.3125 7.3875 2.5875 8.4375 2.5875C9.4375 2.5875 10.3563 2.33125 11.1938 1.81875C12.0312 1.30625 12.8 0.7 13.5 0C14.2 0.7 14.9688 1.30625 15.8062 1.81875C16.6437 2.33125 17.5625 2.5875 18.5625 2.5875C19.6125 2.5875 20.575 2.3125 21.45 1.7625C22.325 1.2125 23.175 0.625 24 0L21.3375 12H18.2625L19.725 5.5125C19.725 5.5125 19.6313 5.525 19.4438 5.55C19.2563 5.575 18.9625 5.5875 18.5625 5.5875C17.6625 5.5875 16.7812 5.45 15.9187 5.175C15.0562 4.9 14.25 4.5125 13.5 4.0125C12.775 4.5125 11.9937 4.9 11.1562 5.175C10.3188 5.45 9.4625 5.5875 8.5875 5.5875C8.1375 5.5875 7.80625 5.575 7.59375 5.55C7.38125 5.525 7.275 5.5125 7.275 5.5125L8.7375 12H5.6625Z"
				fill={color}
			/>
		</svg>
	);
}

function TrendingUpIcon() {
	return (
		<svg
			width="20"
			height="12"
			viewBox="0 0 20 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M1.4 12L0 10.6L7.4 3.15L11.4 7.15L16.6 2H14V0H20V6H18V3.4L11.4 10L7.4 6L1.4 12Z"
				fill="currentColor"
			/>
		</svg>
	);
}

function RocketIcon() {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M0.275 8.19442L4.475 3.99442C4.70833 3.76109 4.98333 3.59442 5.3 3.49442C5.61667 3.39442 5.94167 3.37775 6.275 3.44442L7.575 3.71942C6.675 4.78609 5.96667 5.75275 5.45 6.61942C4.93333 7.48609 4.43333 8.53609 3.95 9.76942L0.275 8.19442ZM5.4 10.4694C5.78333 9.26942 6.30417 8.13609 6.9625 7.06942C7.62083 6.00275 8.41667 5.00275 9.35 4.06942C10.8167 2.60275 12.4917 1.50692 14.375 0.781922C16.2583 0.0569215 18.0167 -0.163912 19.65 0.119421C19.9333 1.75275 19.7167 3.51109 19 5.39442C18.2833 7.27775 17.1917 8.95275 15.725 10.4194C14.8083 11.3361 13.8083 12.1319 12.725 12.8069C11.6417 13.4819 10.5 14.0111 9.3 14.3944L5.4 10.4694ZM12.3 7.46942C12.6833 7.85275 13.1542 8.04442 13.7125 8.04442C14.2708 8.04442 14.7417 7.85275 15.125 7.46942C15.5083 7.08609 15.7 6.61525 15.7 6.05692C15.7 5.49859 15.5083 5.02775 15.125 4.64442C14.7417 4.26109 14.2708 4.06942 13.7125 4.06942C13.1542 4.06942 12.6833 4.26109 12.3 4.64442C11.9167 5.02775 11.725 5.49859 11.725 6.05692C11.725 6.61525 11.9167 7.08609 12.3 7.46942ZM11.6 19.4944L10 15.8194C11.2333 15.3361 12.2875 14.8361 13.1625 14.3194C14.0375 13.8028 15.0083 13.0944 16.075 12.1944L16.325 13.4944C16.3917 13.8278 16.375 14.1569 16.275 14.4819C16.175 14.8069 16.0083 15.0861 15.775 15.3194L11.6 19.4944ZM1.875 13.6694C2.45833 13.0861 3.16667 12.7903 4 12.7819C4.83333 12.7736 5.54167 13.0611 6.125 13.6444C6.70833 14.2278 7 14.9361 7 15.7694C7 16.6028 6.70833 17.3111 6.125 17.8944C5.70833 18.3111 5.0125 18.6694 4.0375 18.9694C3.0625 19.2694 1.71667 19.5361 0 19.7694C0.233333 18.0528 0.5 16.7111 0.8 15.7444C1.1 14.7778 1.45833 14.0861 1.875 13.6694Z"
				fill="#244400"
			/>
		</svg>
	);
}
