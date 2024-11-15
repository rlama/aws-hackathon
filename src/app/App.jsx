import { useEffect } from "react";
import Game from "./components/Game";
import "./App.scss";
import ErrorBoundary from "./components/molecules/ErrorBoundary/ErrorBounday";

export default function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <Game />
      </ErrorBoundary>
    </div>
  );
}
