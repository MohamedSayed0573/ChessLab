import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/homePage";
import PlayGame from "./pages/playGame";
import PlayerGame from "./pages/playerGame";
import ComputerGame from "./pages/computerGame";
import { routes } from "./routes";
import NotFound from "./pages/notFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.home} element={<HomePage />} />
        <Route path={routes.play.root} element={<PlayGame />} />
        <Route path={routes.play.game.pattern} element={<PlayerGame />} />
        <Route path={routes.play.computer} element={<ComputerGame />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
