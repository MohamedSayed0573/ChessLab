import { BrowserRouter, Route, Routes } from "react-router";
import ChessBoard from "./pages/chessBoard";
import HomePage from "./pages/homePage";
import PlayGame from "./pages/playGame";
import ComputerChessBoard from "./pages/computerChessBoard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game/:roomId" element={<ChessBoard />} />
        <Route path="/play" element={<PlayGame />} />
        <Route path="/computer" element={<ComputerChessBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
