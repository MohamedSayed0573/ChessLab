import pawnLogo from "../assets/logo-pawn.svg";
import gameIcon from "../assets/game-icon.svg";
import { Link } from "react-router";

export default function NavBar() {
  return (
    <div className="h-screen w-14 bg-stone-800 text-white">
      <ul className="flex flex-col h-full justify-evenly items-center w-full p-2">
        <li>
          <Link to="/">
            <img src={pawnLogo} alt="home" />
          </Link>
        </li>
        <li>
          <Link to="/play">
            <img src={gameIcon} />
          </Link>
        </li>
      </ul>
    </div>
  );
}
