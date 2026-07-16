import type React from "react";
import NavBar from "./navBar";

export default function Layout({ children }: { children?: React.ReactNode }) {
	return (
		<div className="flex h-full w-full">
			<NavBar />
			<main className="ml-64 flex w-full flex-1">{children}</main>
		</div>
	);
}
