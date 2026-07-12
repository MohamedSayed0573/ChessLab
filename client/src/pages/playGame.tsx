import { useNavigate } from "react-router";
import { socket } from "../socket";
import { useState } from "react";
import type { CreateGameRes, JoinGameRes } from "../../../shared/src/types";
import { routes } from "../routes";
import Layout from "../components/layout";

function PlayComputer() {
  const navigate = useNavigate();
  return (
    <div className="p-6">
      <button
        className="w-full h-14 p-4 rounded hover:cursor-pointer bg-amber-600 font-bold"
        type="button"
        onClick={() => navigate(routes.play.computer)}
      >
        Play Against Computer
      </button>
    </div>
  );
}

function CreateGame() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <button
        className="w-full h-14 p-4 rounded hover:cursor-pointer bg-amber-600 font-bold"
        type="button"
        onClick={() => {
          socket.connect();
          socket.emit("createGame", ({ roomId }: CreateGameRes) => {
            navigate(routes.play.game.path(roomId));
          });
        }}
      >
        Create a new Game Room
      </button>
    </div>
  );
}

function JoinGame() {
  const [message, setMessage] = useState<string>("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  return (
    <div className="p-6">
      <div className="w-full p-4 rounded flex bg-amber-300">
        <span className="flex">{"Enter a game: "}</span>
        <input
          type="text"
          className="flex flex-1 bg-amber-900"
          value={roomId}
          onChange={(e) => {
            setRoomId(e.target.value);
          }}
        />
      </div>

      <button
        type="button"
        className="w-full h-14 p-4 rounded hover:cursor-pointer bg-amber-600 font-bold"
        onClick={() => {
          socket.connect();
          const trimmedRoomId = roomId.trim();
          socket.emit("joinGame", trimmedRoomId, (res: JoinGameRes) => {
            if (!res.success) {
              setMessage(res.message);
            } else {
              navigate(routes.play.game.path(trimmedRoomId));
            }
          });
        }}
      >
        Enter the Game
      </button>
      {message && <div>{message}</div>}
    </div>
  );
}

export default function PlayGame() {
  return (
    <>
      <Layout>
        <CreateGame />
        <JoinGame />
        <PlayComputer />
      </Layout>
    </>
  );
}
