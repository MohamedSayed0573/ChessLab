import { BrowserRouter, Route, Routes } from "react-router";

import Layout from "./components/Layout";
import { routes } from "./routes";
import HomePage from "./pages/homePage";
import PlayerGame from "./pages/playerGame";
import ComputerGame from "./pages/computerGame";
import NotFound from "./pages/notFound";
import PlayPage from "./pages/playPage";
import SignUpPage from "./pages/signupPage";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route path={routes.home} element={<HomePage />} />
					<Route path={routes.play.root} element={<PlayPage />} />
					<Route
						path={routes.play.game.pattern}
						element={<PlayerGame />}
					/>
					<Route
						path={routes.play.computer}
						element={<ComputerGame />}
					/>
					<Route path={routes.signup} element={<SignUpPage />} />
					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
