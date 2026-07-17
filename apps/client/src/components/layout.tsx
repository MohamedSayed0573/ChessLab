import type React from "react";
import NavBar from "./navBar";
import { cn } from "../utils/cn";

export default function Layout({
	children,
	className,
}: {
	children?: React.ReactNode;
	className?: string;
}) {
	return (
		<div className="h-screen">
			<NavBar />
			<main className={cn("ml-64 h-full min-w-0", className)}>
				{children}
			</main>
		</div>
	);
}
