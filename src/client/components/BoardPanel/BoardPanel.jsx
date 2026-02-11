import Board from "../Board/Board";
import "./BoardPanel.css";
import Overlay from "../Overlay/Overlay";

function BoardPanel() {
  return (
    <section className="board-panel">
      <Board />
      <Overlay status={null} isHost={false} />
    </section>
  );
}

export default BoardPanel;
