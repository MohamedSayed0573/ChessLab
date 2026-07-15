export type PlayerColor = "white" | "black";

export type CreateGameRes = {
  success: true;
  roomId: string;
  color: "white";
};

export type JoinGameRes =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
      color: PlayerColor;
};

export type GameOverInfo = {
  reason:
    | "Checkmate"
    | "Stalemate"
    | "Insufficient Material"
    | "Threefold Repetition"
    | "Fifty-Move Rule"
    | "Draw";
  winner?: "white" | "black" | undefined;
};

