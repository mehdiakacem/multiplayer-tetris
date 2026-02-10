import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/HomePage/HomePage.jsx";
import GamePage from "./pages/GamePage/GamePage.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path=":room/:playerName" element={<GamePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/app" element={<App />} />
        </Routes>
    </BrowserRouter>
  </StrictMode>
);
