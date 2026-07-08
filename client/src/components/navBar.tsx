import pawnLogo from "../assets/logo-pawn.svg";
import gameIcon from "../assets/game-icon.svg";

export default function NavBar() {
  return (
    <div className="h-screen w-14 bg-stone-800 text-white">
      <ul className="flex flex-col h-full justify-evenly items-center w-full p-2">
        <li>
          <a href="/">
            <img src={pawnLogo} alt="home" />
          </a>
        </li>
        <li>
          <a href="/game">
            <img src={gameIcon} />
          </a>
        </li>
      </ul>
    </div>
  );
}
