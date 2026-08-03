import { useContext } from "react";
import { authContext } from "../contexts/authContext";

export default function useAuth() {
	const { accessToken, isInitializing, setAccessToken, logout, refresh } =
		useContext(authContext);

	return { accessToken, isInitializing, setAccessToken, logout, refresh };
}
