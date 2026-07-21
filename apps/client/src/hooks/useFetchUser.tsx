import type { User } from "@chesslab/shared/types";
import { useEffect, useState } from "react";

export default function useFetchUser() {
	const [user, setUser] = useState<User | undefined>(undefined);
	useEffect(() => {
		async function fetchUser() {
			const res = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/auth/me`,
				{
					method: "GET",
					credentials: "include",
				},
			);

			if (!res.ok) {
				setUser(undefined);
				return;
			}

			const data = await res.json();
			setUser(data.user);
		}

		fetchUser();
	}, []);

	return [user];
}
