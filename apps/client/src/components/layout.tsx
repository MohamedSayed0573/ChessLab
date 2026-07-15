import type React from "react";
import NavBar from "./navBar";

export default function Layout({ children }: { children?: React.ReactNode }) {
	return (
		<div className="flex">
			<NavBar />
			{children}
		</div>
	);
}
