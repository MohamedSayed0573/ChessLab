import RookIcon from "@icons/RookIcon";
import { NavLink } from "react-router";

interface AuthLayoutProps {
	title: string;
	subtitle: string;
	children: React.ReactNode; // The form component
	footerText: string;
	footerActionText: string;
	footerActionTo: string;
}

export default function AuthLayout({
	title,
	subtitle,
	children,
	footerText,
	footerActionText,
	footerActionTo,
}: AuthLayoutProps) {
	return (
		<main className="font-hanken grid h-full md:grid-cols-2">
			{/* Shared Hero Section */}
			<section className="hidden place-items-center border-r border-[#42493A] bg-[#221F1C] md:grid">
				<div className="flex flex-col items-center justify-center gap-4 px-12 text-center">
					<RookIcon width="45" height="50" />
					<h1 className="text-5xl font-extrabold text-[#E8E1DC]">Master Your Game</h1>
					<p className="text-lg text-[#C2C9B6]">
						Join the most advanced chess platform. Analyze games, learn from
						grandmasters, and elevate your rating.
					</p>
				</div>
			</section>

			{/* Dynamic Right Section */}
			<section className="grid place-items-center bg-[#151310] p-20 py-10">
				<div className="flex flex-1 flex-col">
					<div className="mb-10 flex flex-col gap-2">
						<span className="text-3xl font-bold text-[#E8E1DC]">{title}</span>
						<span className="text-lg text-[#C2C9B6]">{subtitle}</span>
					</div>

					{/* Form */}
					{children}

					{/* Footer Text & Link */}
					<div className="mt-8 flex gap-1 font-sans text-sm">
						<p className="text-[#C2C9B6]">{footerText}</p>
						<NavLink to={footerActionTo} className="text-[#9FD668] hover:underline">
							{footerActionText}
						</NavLink>
					</div>
				</div>
			</section>
		</main>
	);
}
