import type React from "react";
import NavBar from "./navBar";

export default function Layout({ children }: { children?: React.ReactNode }) {
	return (
		<div className="flex min-h-screen w-full">
			<NavBar />
			<main className="ml-64 flex flex-1">{children}</main>
		</div>
	);
}
