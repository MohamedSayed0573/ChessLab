import { useState } from "react";
import useAuth from "@hooks/useAuth";
import { useApi } from "@hooks/useApi";
import { useNavigate } from "react-router";

export function DeleteAccountBtn() {
	const [open, setOpen] = useState(false);
	const { logout } = useAuth();
	const fetchApi = useApi();
	const navigate = useNavigate();

	async function handleDeleteAccount() {
		try {
			const res = await fetchApi("/users/me", {
				method: "DELETE",
			});

			if (!res.ok) {
				console.error("Error: Failed to delete account");
				return;
			}
			navigate("/");

			logout();
		} catch (err) {
			console.error("Error: Failed to delete account", err);
		}
	}

	return (
		<>
			<button
				type="button"
				className="cursor-pointer bg-[#E34A4A] px-6 py-2 text-base font-medium text-[#FFFFFF]"
				onClick={() => setOpen(!open)}
			>
				<p>Remove Account</p>
			</button>

			{open && (
				<div className="fixed inset-0 flex cursor-default items-center justify-center bg-black/50">
					<div className="rounded-lg bg-[#2C2927] p-6">
						<h3 className="mb-4 text-xl font-bold text-[#E8E1DC]">
							Are you sure you want to remove your account?
						</h3>
						<div className="flex justify-evenly gap-4">
							<button
								className="flex cursor-pointer items-center justify-center bg-[#9FD668] px-6 py-2 text-base font-medium text-[#1C3700]"
								onClick={handleDeleteAccount}
							>
								<span className="material-symbols-outlined">check</span>
							</button>

							<button
								type="button"
								className="cursor-pointer border border-[#373431] px-6 py-2 text-base font-medium text-[#E8E1DC] hover:bg-[#373431]"
								onClick={() => setOpen(!open)}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
