import type React from "react";
import NavBar from "./navBar";
import { cn } from "../utils/cn";
import { NavBarContext } from "../contexts/navBarContext";
import { useState } from "react";

export default function Layout({
	children,
	className,
}: {
	children?: React.ReactNode;
	className?: string;
}) {
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
					{children}
				</main>
			</div>
		</NavBarContext.Provider>
	);
}
