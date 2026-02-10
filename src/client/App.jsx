import "./App.css";
import Game from "./components/Game/Game";
import Header from "./components/Header/Header";

export default function App() {
  return (
    <div className="app">
      <Header roomName={null} status={null} isHost={false} />
      <Game />
    </div>
  );
}
