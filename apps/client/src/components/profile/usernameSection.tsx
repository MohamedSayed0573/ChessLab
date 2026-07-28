import { useState } from "react";
import useUser from "../../hooks/useUser";
import { useApi } from "../../hooks/useApi";

export function UsernameSection() {
	const { user, setUser } = useUser();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState<string>(user!.name);
	const fetchApi = useApi();

	async function handleEditBtn() {
		// Return if the name hasn't changed
		if (name === user?.name) return setOpen(!open);

		setUser((prev) => (prev ? { ...prev, name } : prev));

		fetchApi("/users/me/username", {
			method: "PATCH",
			body: JSON.stringify({
				newUsername: name,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		}).catch(() => console.error("Error: Failed to change username"));

		setOpen(!open);
	}

	return (
		<span className="relative text-4xl font-bold text-[#E8E1DC]">
			{open ? (
				<>
					<input
						className="w-[50%] rounded border p-1"
						type="text"
						placeholder={user?.name}
						value={name}
						onChange={(e) => setName(e.currentTarget.value)}
					/>
					<button
						className="ml-2 cursor-pointer"
						onClick={handleEditBtn}
					>
						<span className="material-symbols-outlined">check</span>
					</button>
				</>
			) : (
				<button type="button" onClick={() => setOpen(!open)}>
					<span className="material-symbols-outlined absolute top-2 left-full ml-2 cursor-pointer">
						edit
					</span>
					{user?.name}
				</button>
			)}
		</span>
	);
}
