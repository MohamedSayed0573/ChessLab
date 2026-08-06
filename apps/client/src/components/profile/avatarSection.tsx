import { useApi } from "@hooks/useApi";
import useUser from "@hooks/useUser";
import defaultAvatar from "@assets/default-avatar.svg";

export function AvatarSection() {
	const { user, setUser } = useUser();
	const fetchApi = useApi();
	if (!user) return;

	const imageUrl = user.avatarUrl;

	async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("avatar", file);

		const res = await fetchApi("/users/me/avatar", {
			method: "PATCH",
			body: formData,
		});

		if (res.ok) {
			const data = await res.json();
			setUser((prev) => (prev ? { ...prev, avatarUrl: data.avatarUrl } : prev));
		}
	}

	return (
		<div className="relative h-37.5 w-37.5 bg-white">
			<label htmlFor="profile-image" className="cursor-pointer">
				<span className="material-symbols-outlined absolute right-2 bottom-2">edit</span>
				<input
					id="profile-image"
					type="file"
					className="hidden"
					onChange={handleImageChange}
				/>
				<img
					src={imageUrl || defaultAvatar}
					alt="Profile"
					className="h-37.5 w-37.5 object-cover"
				/>
			</label>
		</div>
	);
}
