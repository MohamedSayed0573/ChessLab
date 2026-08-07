import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "@hooks/useAuth";

export default function RequireAuth() {
	const { accessToken, isInitializing } = useAuth();
	const location = useLocation();

	if (isInitializing) return null;

	if (!accessToken) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}
	return <Outlet />;
}
