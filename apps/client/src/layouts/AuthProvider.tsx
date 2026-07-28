import { useEffect, useState } from "react";
import { authContext } from "../contexts/authContext";

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [accessToken, setAccessToken] = useState<string | undefined>(
		undefined,
	);

	const logout = () => setAccessToken(undefined);
	const refresh = async () => {
		const res = await fetch(
			`${import.meta.env.VITE_SERVER_URL}/auth/refresh`,
			{
				method: "POST",
				credentials: "include",
			},
		);

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
			await refresh();
		}

		refreshToken();
	}, []);

	return (
		<authContext.Provider
			value={{
				accessToken,
				setAccessToken,
				logout,
				refresh,
			}}
		>
			{children}
		</authContext.Provider>
	);
}
