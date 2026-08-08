import { Navigate, Outlet, useLocation, type Location } from "react-router";
import useAuth from "@hooks/auth/useAuth";

export default function NotLoggedIn() {
	const { accessToken, isInitializing } = useAuth();
	const location = useLocation();
	const from = (location.state as { from?: Location } | null)?.from;

	if (isInitializing) return null;

	if (accessToken) {
		return <Navigate to={from ?? "/"} replace />;
	}
	return <Outlet />;
}
