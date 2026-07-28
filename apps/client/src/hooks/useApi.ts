import useAuth from "./useAuth";

export function useApi() {
	const { accessToken, refresh, logout } = useAuth();

	async function fetchWrapper(
		path: string,
		options: RequestInit = {},
		accessTokenOverride?: string,
	) {
		const token = accessTokenOverride ?? accessToken;
		const cleanPath = path.startsWith("/") ? path.slice(1) : path;
		return fetch(`${import.meta.env.VITE_SERVER_URL}/${cleanPath}`, {
			...options,
			credentials: "include",
			headers: {
				...options.headers,
				...(token && {
					Authorization: `Bearer ${token}`,
				}),
			},
		});
	}

	async function fetchApi(path: string, options: RequestInit = {}) {
		const response = await fetchWrapper(path, options);

		if (response.status === 401) {
			const newAccessToken = await refresh();
			if (!newAccessToken) {
				logout();
				return response;
			}

			const retryResponse = await fetchWrapper(
				path,
				options,
				newAccessToken,
			);

			if (retryResponse.status === 401) {
				logout();
				await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, {
					method: "POST",
					credentials: "include",
				});
			}
			return retryResponse;
		}

		return response;
	}

	return fetchApi;
}
