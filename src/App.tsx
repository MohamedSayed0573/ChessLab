import { BrowserRouter, Route, Routes } from "react-router";
import ChessBoard from "./pages/chessBoard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/game" element={<ChessBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
