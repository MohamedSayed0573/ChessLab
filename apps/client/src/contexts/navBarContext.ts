import { createContext } from "react";

interface NavBarContentType {
	collapsed: boolean;
	toggle: () => void;
}

export const NavBarContext = createContext<NavBarContentType>({
	collapsed: true,
	toggle: () => {},
});
