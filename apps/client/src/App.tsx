import { BrowserRouter, Route, Routes } from "react-router";

import Layout from "./layouts/Layout";
import { routes } from "./routes";
import HomePage from "./pages/homePage";
import PlayerGame from "./pages/playerGame";
import ComputerGame from "./pages/computerGame";
import NotFound from "./pages/notFound";
import SignUpPage from "./pages/signupPage";
import LoginPage from "./pages/loginPage";
import ProfilePage from "./pages/profilePage";
import RequireAuth from "./layouts/RequireAuth";
import NotLoggedIn from "./layouts/NotLoggedIn";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route path={routes.home} element={<HomePage />} />

					<Route path={routes.computer} element={<ComputerGame />} />

					<Route element={<NotLoggedIn />}>
						<Route path={routes.signup} element={<SignUpPage />} />
						<Route path={routes.login} element={<LoginPage />} />
					</Route>

					<Route element={<RequireAuth />}>
						<Route
							path={routes.profile}
							element={<ProfilePage />}
						/>

						<Route
							path={routes.game.pattern}
							element={<PlayerGame />}
						/>
					</Route>

					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
