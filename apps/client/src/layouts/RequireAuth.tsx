import { Navigate, Outlet } from "react-router";
import useUser from "../hooks/useUser";

export default function RequireAuth() {
	const { user } = useUser();

	if (!user) {
		return <Navigate to="/login" replace />;
	}
	return <Outlet />;
}
