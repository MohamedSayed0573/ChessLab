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
