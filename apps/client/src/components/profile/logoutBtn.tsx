import { useNavigate } from "react-router";
import { useApi } from "@hooks/useApi";
import useAuth from "@hooks/useAuth";

export function LogoutBtn() {
	const { logout } = useAuth();
	const fetchApi = useApi();
	const navigate = useNavigate();

	async function handleLogout() {
		try {
			await fetchApi("/auth/logout", {
				method: "POST",
			});

			navigate("/");

			logout();
		} catch (err) {
			console.error("Logout failed:", err);
		}
	}

	return (
		<button
			type="button"
			className="cursor-pointer border border-[#8F3036] bg-[#2A1618] px-6 py-2 text-base font-medium text-[#FF6B6B] hover:bg-[#373431]"
			onClick={handleLogout}
		>
			Logout
		</button>
	);
}
