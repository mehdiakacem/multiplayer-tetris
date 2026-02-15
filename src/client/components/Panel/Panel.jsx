import "./Panel.css";

function Panel({ children }) {
  return <aside className="panel">{children}</aside>;
}

export default Panel;
