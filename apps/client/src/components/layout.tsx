import NavBar from "./navBar";
import { cn } from "../utils/cn";
import { NavBarContext } from "../contexts/navBarContext";
import { useState } from "react";
import { Outlet } from "react-router";

export default function Layout({ className }: { className?: string }) {
	const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

	return (
		<NavBarContext.Provider
			value={{
				collapsed: isCollapsed,
				toggle: () => setIsCollapsed((prev) => !prev),
			}}
		>
			<div className="h-screen">
				<NavBar />
				<main
					className={cn(
						"h-full min-w-0",
						className,
						isCollapsed ? "ml-12" : "ml-64",
					)}
				>
					<Outlet />
				</main>
			</div>
		</NavBarContext.Provider>
	);
}
