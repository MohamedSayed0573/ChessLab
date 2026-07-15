import clsx from "clsx";
import { NavLink } from "react-router";

export default function NavBar() {
	return (
		<aside className="flex  flex-col h-screen w-[256px] bg-[#221F1C] text-white fixed top-0 left-0 px-4 py-6">
			<div className="flex flex-col gap-2 pb-8">
				<NavLink to="/" className="text-[#E8E1DC] font-bold text-2xl">
					Grandmaster Slate
				</NavLink>
				<span className="text-[#C2C9B6] font-medium text-sm">
					Professional Interface
				</span>
			</div>
			<nav className="flex flex-col gap-3 text-[#C2C9B6] flex-1">
				<SidebarItem to="/play" icon="play_circle" label="Play" />
				<SidebarItem to="/puzzles" icon="extension" label="Puzzles" />
				<SidebarItem to="/learn" icon="menu_book" label="Learn" />
				<SidebarItem to="/watch" icon="visibility" label="Watch" />
			</nav>
			<nav className="border-t border-zinc-800 pt-2">
				<SidebarItem to="/settings" icon="settings" label="Settings" />
				<SidebarItem to="/help" icon="help" label="Help" />
			</nav>
		</aside>
	);
}

function SidebarItem({
	to,
	icon,
	label,
}: {
	to: string;
	icon: string;
	label: string;
}) {
	return (
		<NavLink
			to={to}
			className={({ isActive, isPending }) =>
				clsx(
					"rounded-lg px-4 py-3 text-sm font-medium flex gap-3 items-center cursor-pointer transition-colors",
					isActive
						? "bg-lime-500 text-black"
						: "text-zinc-300 hover:bg-zinc-800",
					isPending && "cursor-none",
				)
			}
		>
			<span className="material-symbols-outlined">{icon}</span>
			<span>{label}</span>
		</NavLink>
	);
}
