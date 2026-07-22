import { NavLink } from "react-router";
import useUser from "../hooks/useUser";

export default function HomePage() {
	const user = useUser();

	const signout = async () => {
		if (!user) return;
		await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, {
			method: "POST",
			credentials: "include",
		});
		window.location.reload();
	};

	return (
		<>
			<div>{user?.name}</div>
			<button
				onClick={signout}
				className="rounded-md bg-[#9FD668] px-4 py-2 text-sm font-medium text-[#151310] hover:cursor-pointer hover:bg-[#8AC85A]"
			>
				Sign Out
			</button>
			<NavLink
				to="/signup"
				className="rounded-md bg-[#9FD668] px-4 py-2 text-sm font-medium text-[#151310] hover:bg-[#8AC85A]"
			>
				Sign Up
			</NavLink>
			<NavLink
				to="/login"
				className="rounded-md bg-[#9FD668] px-4 py-2 text-sm font-medium text-[#151310] hover:bg-[#8AC85A]"
			>
				Login
			</NavLink>
		</>
	);
}
