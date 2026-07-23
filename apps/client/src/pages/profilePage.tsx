import { useState } from "react";
import useUser from "../hooks/useUser";
import defaultAvatar from "../assets/default-avatar.svg";

export default function ProfilePage() {
	const { user } = useUser();
	if (!user) return;

	return (
		<main className="h-full bg-[#151310] p-8 font-mono">
			{/* Profile Section */}
			<section className="flex gap-8 p-8">
				{/* Profile Image */}
				<AvatarSection />

				{/* Profile Info */}
				<div className="flex flex-col">
					{/* Profile Header */}
					<header>
						<h1 className="text-4xl font-bold text-[#E8E1DC]">
							{user.name}
						</h1>
						<p className="pb-4 text-base text-[#9FD668]">
							@{user.username}
						</p>
					</header>

					{/* Profile Details */}
					<div className="flex gap-5">
						<div className="flex gap-2">
							<span className="material-symbols-outlined">
								mail
							</span>
							<p className="text-base text-[#BAB9B8]">
								{user.email}
							</p>
						</div>
						<div className="flex gap-2">
							<span className="material-symbols-outlined">
								date_range
							</span>
							<p className="text-base text-[#BAB9B8]">
								JOINED {user.createdAt}
							</p>
						</div>
					</div>

					{/* Profile Buttons */}
					<div className="flex gap-3 pt-6">
						<EditProfileBtn />
						<LogoutBtn />
					</div>
				</div>
			</section>

			{/* Stats */}
			<section className="grid grid-cols-3 gap-6">
				<div className="flex flex-col items-center justify-center gap-6 p-6">
					<span className="flex w-full justify-center border-b border-[#373431] pb-2 text-center text-base font-medium text-[#BAB9B8]">
						CURRENT ELO
					</span>
					<span className="text-5xl font-bold text-[#9FD668]">
						{user.elo}
					</span>
				</div>

				<div className="flex flex-col items-center justify-center gap-6 p-6">
					<span className="flex w-full justify-center border-b border-[#373431] pb-2 text-center text-base font-medium text-[#BAB9B8]">
						PEAK RATING
					</span>
					<span className="text-5xl font-bold text-[#9FD668]">
						{user.elo}
					</span>
				</div>

				<div className="flex flex-col items-center justify-center gap-6 p-6">
					<span className="flex w-full justify-center border-b border-[#373431] pb-2 text-center text-base font-medium text-[#BAB9B8]">
						WIN PERCENTAGE
					</span>
					<span className="text-5xl font-bold text-[#9FD668]">
						{user.elo}
					</span>
				</div>
			</section>

			{/* Match History */}
			<section className="flex flex-col">
				<div className="flex justify-between border-b border-[#373431] p-6">
					<span className="text-[20px] font-bold text-[#E8E1DC]">
						MATCH HISTORY
					</span>
					<span className="text-base font-medium text-[#9FD668]">
						View All
					</span>
				</div>

				<table>
					<thead className="border-b border-[#373431] bg-[#2C2927] text-left text-base font-medium text-[#BAB9B8]">
						<tr>
							<th className="p-4">OPPONENT</th>
							<th className="p-4">FORMAT</th>
							<th className="p-4">RESULT</th>
							<th className="p-4">DATE</th>
						</tr>
					</thead>

					<tbody className="text-sm text-[#E8E1DC]">
						<tr className="border-b border-[#373431]">
							<td className="p-4">Opponent 1</td>
							<td className="p-4">Format 1</td>
							<td className="p-4">Result 1</td>
							<td className="p-4">Date 1</td>
						</tr>
					</tbody>
				</table>
			</section>
		</main>
	);
}

function EditProfileBtn() {
	const [openDropdown, setOpenDropdown] = useState(false);

	function handleEditProfile() {
		setOpenDropdown(!openDropdown);
	}

	return (
		<>
			<button
				type="button"
				className="cursor-pointer bg-[#9FD668] px-6 py-2 text-base font-medium text-[#1C3700]"
				onClick={handleEditProfile}
			>
				Edit Profile
			</button>
		</>
	);
}

function LogoutBtn() {
	async function handleLogout() {
		try {
			await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, {
				method: "POST",
				credentials: "include",
			});

			window.location.href = "/";
		} catch (err) {
			console.error("Logout failed:", err);
		}
	}

	return (
		<button
			type="button"
			className="cursor-pointer border border-[#373431] px-6 py-2 text-base font-medium text-[#E8E1DC] hover:bg-[#373431]"
			onClick={handleLogout}
		>
			Logout
		</button>
	);
}

function AvatarSection() {
	const { user, setUser } = useUser();
	if (!user) return;

	const imageUrl = user.avatarUrl;

	async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("avatar", file);

		const res = await fetch(
			`${import.meta.env.VITE_SERVER_URL}/users/me/avatar`,
			{
				method: "PATCH",
				body: formData,
				credentials: "include",
			},
		);

		if (res.ok) {
			const data = await res.json();
			setUser((prev) =>
				prev ? { ...prev, avatarUrl: data.avatarUrl } : prev,
			);
		}
	}

	return (
		<div className="relative h-37.5 w-37.5 bg-white">
			<label htmlFor="profile-image" className="cursor-pointer">
				<span className="material-symbols-outlined absolute right-2 bottom-2">
					edit
				</span>
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
