import { Navigate, NavLink } from "react-router";
import RookIcon from "../icons/RookIcon";
import { useState } from "react";
import useUser from "../hooks/useUser";

export default function LoginPage() {
	const user = useUser();
	if (user) {
		<Navigate to="/" replace />;
	}

	return (
		<main className="font-hanken grid h-full md:grid-cols-2">
			<section className="hidden place-items-center border-r border-[#42493A] bg-[#221F1C] md:grid">
				<div className="flex flex-col items-center justify-center gap-4 px-12 text-center">
					<RookIcon width="45" height="50" />
					<h1 className="text-5xl font-extrabold text-[#E8E1DC]">
						Master Your Game
					</h1>
					<p className="text-lg text-[#C2C9B6]">
						Join the most advanced chess platform. Analyze games,
						learn from grandmasters, and elevate your rating.
					</p>
				</div>
			</section>

			<section className="grid place-items-center bg-[#151310] p-20">
				<div className="flex flex-1 flex-col">
					<div className="mb-10 flex flex-col gap-2">
						<span className="text-3xl font-bold text-[#E8E1DC]">
							Log In
						</span>
						<span className="text-lg text-[#C2C9B6]">
							Sign in to your account.
						</span>
					</div>

					<Form />

					<div className="mt-8 flex gap-1">
						<p>Don't have an account?</p>
						<NavLink to="/signup" className="text-[#9FD668]">
							Sign Up
						</NavLink>
					</div>
				</div>
			</section>
		</main>
	);
}

function Form() {
	const [error, setError] = useState<string | undefined>(undefined);

	async function submitForm(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const email = formData.get("email");
		const password = formData.get("password");

		const res = await fetch(
			`${import.meta.env.VITE_SERVER_URL}/auth/login`,
			{
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					password,
				}),
			},
		);

		const data = await res.json();
		console.log(data);

		if (!data.success) {
			setError(data.message);
			return;
		}

		window.location.href = "/";
	}

	return (
		<>
			<form
				className="flex flex-col gap-5 font-mono text-sm font-medium"
				onSubmit={submitForm}
			>
				<div className="flex flex-col gap-2">
					<label className="text-[#C2C9B6]" htmlFor="email">
						Email
					</label>
					<input
						id="email"
						type="email"
						name="email"
						placeholder="Enter your email"
						className="rounded-md border border-[#42493A] bg-[#221F1C] px-4 py-3 text-[#6B7280]"
						required
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label className="text-[#C2C9B6]" htmlFor="password">
						Password
					</label>
					<input
						id="password"
						type="password"
						name="password"
						className="rounded-md border border-[#42493A] bg-[#221F1C] px-4 py-3 text-[#6B7280]"
						placeholder="Enter your password"
						required
					/>
				</div>

				<button
					type="submit"
					className="rounded-md bg-[#81B64C] py-3 text-sm font-medium text-white hover:cursor-pointer hover:bg-[#5A6150]"
				>
					Log In
				</button>
			</form>
			{error && (
				<div className="mt-4 rounded-md bg-[#221F1C] px-4 py-3 text-sm text-red-500">
					{error}
				</div>
			)}
		</>
	);
}
