import pawnLogo from "../assets/logo-pawn.svg";
import gameIcon from "../assets/game-icon.svg";
import { Link } from "react-router";
import { routes } from "../routes";

export default function NavBar() {
  return (
    <div className="h-screen w-14 bg-stone-800 text-white">
      <ul className="flex flex-col h-full justify-evenly items-center w-full p-2">
        <li>
          <Link to={routes.home}>
            <img src={pawnLogo} alt="home" />
          </Link>
        </li>
        <li>
          <Link to={routes.play.root}>
            <img src={gameIcon} />
          </Link>
        </li>
      </ul>
    </div>
  );
}
