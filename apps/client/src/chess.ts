import type { Chess } from "chess.js";

export function getGameResult(chess: Chess): string | undefined {
  if (!chess.isGameOver()) return undefined;

  if (chess.isCheckmate()) {
    const winner = chess.turn() === "w" ? "Black" : "White";
    return `Checkmate — ${winner} wins!`;
  }
  if (chess.isStalemate()) return "Draw — stalemate";
  if (chess.isInsufficientMaterial()) return "Draw — insufficient material";
  if (chess.isDrawByFiftyMoves()) return "Draw — fifty-move rule";
  if (chess.isThreefoldRepetition()) return "Draw — threefold repetition";
  if (chess.isDraw()) return "Draw";
  return "Game over";
}
