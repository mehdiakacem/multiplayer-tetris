import "./EmptyBoard.css";

export default function EmptyBoard({children}) {
    return (
      <div className="empty-board">
        {children}
      </div>
    );
}
