import type { User } from "@chesslab/shared/types";
import { useEffect, useState } from "react";
import { useApi } from "@hooks/useApi";
import useAuth from "@hooks/useAuth";

export default function useFetchUser() {
	const [user, setUser] = useState<User | undefined>(undefined);
	const { accessToken } = useAuth();
	const fetchApi = useApi();

	if (!accessToken && user !== undefined) {
		setUser(undefined);
	}

	useEffect(() => {
		if (!accessToken) return;

		async function fetchUser() {
			const res = await fetchApi("/auth/me", {
				method: "GET",
			});

			if (!res.ok) {
				setUser(undefined);
				return;
			}

			const data = await res.json();
			setUser(data.user);
		}

		fetchUser();
	}, [fetchApi, accessToken]);

	return [user, setUser] as const;
}
