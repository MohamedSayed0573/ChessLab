import { NavLink } from "react-router";
import { cn } from "../utils/cn";

export default function MobileBottomNav() {
	return (
		<aside className="fixed bottom-0 left-0 max-h-22 w-full border-r border-[#424A35] bg-[#221F1C] p-1 text-white transition-all duration-300 sm:hidden">
			<nav className="flex items-center justify-between text-[#C2C9B6]">
				<SidebarItem to="/" icon="home" label="home" />
				<SidebarItem to="/puzzles" icon="extension" label="Puzzles" />
				<SidebarItem to="/learn" icon="menu_book" label="Learn" />
				<SidebarItem to="/watch" icon="visibility" label="Watch" />
				<SidebarItem to="/settings" icon="settings" label="Settings" />
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
					"flex cursor-pointer items-center justify-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
					isActive
						? "bg-lime-500 text-black"
						: "text-zinc-300 hover:bg-zinc-800",
					isPending && "cursor-wait",
				)
			}
		>
			<div className="flex flex-col items-center justify-center gap-1">
				<span className="material-symbols-outlined">{icon}</span>
				<span className="text-base font-semibold">{label}</span>
			</div>
		</NavLink>
	);
}
