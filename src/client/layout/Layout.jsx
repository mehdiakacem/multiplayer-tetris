import { Link } from "react-router";
import "./Layout.css";

function Layout({ children }) {
  return (
    <div className="layout">
      <header className="header">
        <Link to="/">
          <h1>Red Tetris</h1>
        </Link>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default Layout;
