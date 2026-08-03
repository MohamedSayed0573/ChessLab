const serverUrl = import.meta.env.VITE_SERVER_URL;

if (!serverUrl) {
	throw new Error("VITE_SERVER_URL is not configured");
}

export const SERVER_URL = serverUrl.replace(/\/$/, "");
