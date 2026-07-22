import { useContext } from "react";
import { cn } from "../utils/cn";
import { NavLink } from "react-router";
import { NavBarContext } from "../contexts/navBarContext";
import useUser from "../hooks/useUser";

export default function DesktopNav() {
	const { collapsed: isCollapsed, toggle } = useContext(NavBarContext);
	const user = useUser();

	return (
		<aside
			className={cn(
				"fixed top-0 left-0 hidden h-screen w-[256px] flex-col border-r border-[#424A35] bg-[#221F1C] px-4 py-6 text-white transition-all duration-300 sm:flex",
				{ "w-12 px-1 py-0": isCollapsed },
			)}
		>
			<button
				className="absolute top-4 right-3 cursor-pointer"
				onClick={() => {
					toggle();
				}}
			>
				<span className="material-symbols-outlined">
					{isCollapsed ? "right_panel_close" : "right_panel_open"}
				</span>
			</button>

			{!isCollapsed && (
				<div className="flex flex-col gap-2 pb-8">
					<NavLink
						to="/"
						className="text-2xl font-bold text-[#E8E1DC]"
					>
						Grandmaster
					</NavLink>
					<span className="text-sm font-medium text-[#C2C9B6]">
						Professional Interface
					</span>
				</div>
			)}
			<nav
				className={cn("flex flex-1 flex-col gap-3 text-[#C2C9B6]", {
					"gap-5 pt-18": isCollapsed,
				})}
			>
				<SidebarItem to="/" icon="home" label="home" />
				<SidebarItem to="/puzzles" icon="extension" label="Puzzles" />
				<SidebarItem to="/learn" icon="menu_book" label="Learn" />
				<SidebarItem to="/watch" icon="visibility" label="Watch" />
			</nav>
			<nav className="border-t border-zinc-800 pt-2">
				{!user && (
					<>
						<SidebarItem to="/login" icon="login" label="Login" />
						<SidebarItem
							to="/signup"
							icon="person_add"
							label="Signup"
						/>
					</>
				)}
				{user && (
					<>
						<SidebarItem
							to="/profile"
							icon="account_circle"
							label="Profile"
						/>
						<SidebarItem
							to="/settings"
							icon="settings"
							label="Settings"
						/>
					</>
				)}
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
	const { collapsed: iconOnly } = useContext(NavBarContext);

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
					iconOnly && "group relative justify-center",
				)
			}
		>
			{iconOnly && (
				<span className="absolute left-full ml-3 rounded-md bg-zinc-900 px-2 py-1 text-sm whitespace-nowrap text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
					{label}
				</span>
			)}
			<span className="material-symbols-outlined">{icon}</span>
			{!iconOnly && <span>{label}</span>}
		</NavLink>
	);
}
