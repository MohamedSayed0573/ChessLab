import { createContext } from "react";

export interface AuthContextValue {
	accessToken: string | undefined;
	setAccessToken: (token: string | undefined) => void;
	refresh: () => Promise<string | undefined>;
	logout: () => void;
}

export const authContext = createContext<AuthContextValue>({
	accessToken: undefined,
	setAccessToken: () => {},
	refresh: async () => {},
	logout: () => {},
});
