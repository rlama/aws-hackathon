import { useEffect } from "react";
import SpriteAnimation from './SpriteAnimation';

import "./Game.scss";

export default function Game() {
  return (
    <div className="Game">
      <SpriteAnimation />
    </div>
  );
}
