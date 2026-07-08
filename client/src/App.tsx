import { BrowserRouter, Route, Routes } from "react-router";
import ChessBoard from "./pages/chessBoard";
import HomePage from "./pages/homePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<ChessBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
