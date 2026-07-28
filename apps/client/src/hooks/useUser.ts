import { useContext } from "react";
import { userContext } from "../contexts/userContext";

export default function useUser() {
	const { user, setUser } = useContext(userContext);
	const removeUser = () => setUser(undefined);
	return { user, setUser, removeUser };
}
