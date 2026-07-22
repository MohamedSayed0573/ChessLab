import { cn } from "../utils/cn";
import { NavBarContext } from "../contexts/navBarContext";
import { userContext } from "../contexts/userContext";
import { useState } from "react";
import { Outlet } from "react-router";
import Navigation from "./Navigation";
import useFetchUser from "../hooks/useFetchUser";

export default function Layout({ className }: { className?: string }) {
	const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
	const [user] = useFetchUser();

	return (
		<userContext.Provider value={user}>
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
		</userContext.Provider>
	);
}
