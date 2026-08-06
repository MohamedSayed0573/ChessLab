import { useEffect, useState } from "react";
import { authContext } from "@contexts/authContext";
import { SERVER_URL } from "@/config";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
	const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
	const [isInitializing, setIsInitializing] = useState(true);

	const logout = () => setAccessToken(undefined);
	const refresh = async () => {
		const res = await fetch(`${SERVER_URL}/auth/refresh`, {
			method: "POST",
			credentials: "include",
		});

		if (!res.ok) {
			setAccessToken(undefined);
			return;
		}

		const data = await res.json();
		setAccessToken(data.accessToken);
		return data.accessToken;
	};

	useEffect(() => {
		async function refreshToken() {
			try {
				await refresh();
			} finally {
				setIsInitializing(false);
			}
		}

		refreshToken();
	}, []);

	return (
		<authContext.Provider
			value={{
				accessToken,
				isInitializing,
				setAccessToken,
				logout,
				refresh,
			}}
		>
			{children}
		</authContext.Provider>
	);
}
