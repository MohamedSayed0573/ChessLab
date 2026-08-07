import { createContext } from "react";

export interface AuthContextValue {
	accessToken: string | undefined;
	isInitializing: boolean;
	setAccessToken: (token: string | undefined) => void;
	refresh: () => Promise<string | undefined>;
	logout: () => void;
}

export const authContext = createContext<AuthContextValue>({
	accessToken: undefined,
	isInitializing: true,
	setAccessToken: () => {},
	refresh: async () => undefined,
	logout: () => {},
});
