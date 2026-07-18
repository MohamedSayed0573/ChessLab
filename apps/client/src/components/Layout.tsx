import { cn } from "../utils/cn";
import { NavBarContext } from "../contexts/navBarContext";
import { useState } from "react";
import { Outlet } from "react-router";
import Navigation from "./Navigation";

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
				<Navigation />
				<main
					className={cn(
						"h-full min-w-0",
						className,
						isCollapsed ? "sm:ml-12" : "sm:ml-64",
					)}
				>
					<Outlet />
				</main>
			</div>
		</NavBarContext.Provider>
	);
}
