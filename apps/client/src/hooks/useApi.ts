import { SERVER_URL } from "@/config";
import useAuth from "@/hooks/auth/useAuth";

export function useApi() {
	const { accessToken, refresh, logout } = useAuth();

	async function fetchWrapper(
		path: string,
		options: RequestInit = {},
		accessTokenOverride?: string,
	) {
		const token = accessTokenOverride ?? accessToken;
		const normalizedPath = path.startsWith("/") ? path : `/${path}`;
		return fetch(`${SERVER_URL}${normalizedPath}`, {
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

		if (response.status === 401 && accessToken) {
			const newAccessToken = await refresh();
			if (!newAccessToken) {
				logout();
				return response;
			}

			const retryResponse = await fetchWrapper(path, options, newAccessToken);

			if (retryResponse.status === 401) {
				logout();
				await fetch(`${SERVER_URL}/auth/logout`, {
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
