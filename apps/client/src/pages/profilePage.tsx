import { useState } from "react";

export default function ProfilePage() {
	const [error, setError] = useState<string | null>(null);

	async function handleLogout() {
		try {
			await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, {
				method: "POST",
				credentials: "include",
			});

			window.location.href = "/";
		} catch (err) {
			setError(err instanceof Error ? err.message : String(err));
		}
	}

	return (
		<div className="grid h-full place-items-center p-20">
			<button
				type="button"
				onClick={handleLogout}
				className="rounded-lg bg-amber-900 p-2 hover:cursor-pointer"
			>
				Log out
			</button>
			{error && <p>{error}</p>}
		</div>
	);
}
