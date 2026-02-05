import Game from "./components/Game";
import "./App.css"; 
import { socket } from "./socket";
import { useEffect } from "react";
import { Routes, Route } from "react-router";

function App() {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("hello", (arg) => {
      console.log(arg); // world
    });

    return () => {
      socket.off("connect");
      socket.off("hello");
      socket.disconnect();
    };
  }, []);
  return (
    <div className="app">
      <header className="header">
        <h1>Red Tetris</h1>
      </header>
      <footer className="footer">Status</footer>
    </div>
  );
}

export default App;
