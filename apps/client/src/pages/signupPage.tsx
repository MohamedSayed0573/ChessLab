import { NavLink } from "react-router";
import RookIcon from "../icons/RookIcon";

export default function SignUpPage() {
	return (
		<main className="font-hanken grid h-full grid-cols-2">
			<section className="grid place-items-center border-r border-[#42493A] bg-[#221F1C]">
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
			<section className="grid place-items-center bg-[#151310] p-24">
				<div className="flex flex-1 flex-col">
					<div className="mb-10 flex flex-col gap-2">
						<span className="text-3xl font-bold text-[#E8E1DC]">
							Create Account
						</span>
						<span className="text-lg text-[#C2C9B6]">
							Sign up to start playing and learning.
						</span>
					</div>

					<form className="flex flex-col gap-5 font-mono text-sm font-medium">
						<div className="flex flex-col gap-2">
							<label
								className="text-[#C2C9B6]"
								htmlFor="username"
							>
								Username
							</label>
							<input
								id="username"
								type="text"

								placeholder="Enter your username"
								className="rounded-md border border-[#42493A] bg-[#221F1C] px-4 py-3 text-[#6B7280]"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label className="text-[#C2C9B6]" htmlFor="email">
								Email
							</label>
							<input
								id="email"
								type="email"
								placeholder="Enter your email"
								className="rounded-md border border-[#42493A] bg-[#221F1C] px-4 py-3 text-[#6B7280]"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label
								className="text-[#C2C9B6]"
								htmlFor="password"
							>
								Password
							</label>
							<input
								id="password"
								type="password"
								className="rounded-md border border-[#42493A] bg-[#221F1C] px-4 py-3 text-[#6B7280]"
								placeholder="Enter your password"
							/>
						</div>

						{/* 
						<div className="flex items-center justify-center gap-2">
							<input type="checkbox" className="rounded" />
							<label className="text-base text-[#C2C9B6]">
								I agree to the Terms of Service and Privacy
								Policy.
							</label>
						</div> */}

						<button
							type="submit"
							className="rounded-md bg-[#81B64C] py-3 text-sm font-medium text-white hover:bg-[#5A6150]"
						>
							Register
						</button>
					</form>

					<div className="mt-8 flex gap-1">
						<p>Already have an account?</p>
						<NavLink to="/signin" className="text-[#9FD668]">
							Sign In
						</NavLink>
					</div>
				</div>
			</section>
		</main>
	);
}
