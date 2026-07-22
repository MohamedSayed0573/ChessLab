import { useContext } from "react";
import { userContext } from "../contexts/userContext";

export default function useUser() {
	const user = useContext(userContext);
	return user;
}
