import { NavLink } from "react-router";

export default function NotFound() {
	return (
		<div className="font-hanken flex h-full w-full flex-1 flex-col items-center justify-center gap-6 bg-[#151310]">
			<div className="text-[160px] font-bold -tracking-widest text-[#9FD668]">
				404
			</div>
			<div className="mb-4 text-3xl font-bold text-[#E8E1DC]">
				Page Not Found
			</div>

			<NavLink
				to="/"
				className="rounded-lg bg-[#81B64C] px-12 py-4 text-lg font-bold text-[#244400]"
			>
				Return Home
			</NavLink>
		</div>
	);
}
