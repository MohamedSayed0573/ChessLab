import { createContext } from "react";
import type { User } from "@chesslab/shared/types";

export type UserContextValue = {
	user: User | undefined;
	setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
};

export const userContext = createContext<UserContextValue>({
	user: undefined,
	setUser: () => {},
});
