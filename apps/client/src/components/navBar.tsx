import { cn } from "../utils/cn";
import { NavLink } from "react-router";

export default function NavBar() {
	return (
		<aside className="fixed top-0 left-0 flex h-screen w-[256px] flex-col border-r border-[#424A35] bg-[#221F1C] px-4 py-6 text-white">
			<div className="flex flex-col gap-2 pb-8">
				<NavLink to="/" className="text-2xl font-bold text-[#E8E1DC]">
					Grandmaster Slate
				</NavLink>
				<span className="text-sm font-medium text-[#C2C9B6]">
					Professional Interface
				</span>
			</div>
			<nav className="flex flex-1 flex-col gap-3 text-[#C2C9B6]">
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
				cn(
					"flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
					isActive
						? "bg-lime-500 text-black"
						: "text-zinc-300 hover:bg-zinc-800",
					isPending && "cursor-wait",
				)
			}
		>
			<span className="material-symbols-outlined">{icon}</span>
			<span>{label}</span>
		</NavLink>
	);
}
