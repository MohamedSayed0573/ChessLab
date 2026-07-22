import { Navigate, Outlet } from "react-router";
import useUser from "../hooks/useUser";

export default function NotLoggedIn() {
	const user = useUser();

	if (user) {
		return <Navigate to="/" replace />;
	}
	return <Outlet />;
}
