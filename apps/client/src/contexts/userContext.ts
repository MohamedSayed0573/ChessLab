import { createContext } from "react";
import type { User } from "@chesslab/shared/types";

export const userContext = createContext<User | undefined>(undefined);
