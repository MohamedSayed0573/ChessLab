import { useContext } from "react";
import { authContext } from "../contexts/authContext";

export default function useAuth() {
	const { accessToken, setAccessToken, logout, refresh } =
		useContext(authContext);

	return { accessToken, setAccessToken, logout, refresh };
}
