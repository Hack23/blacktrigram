import React from "react";
import ReactDOM from "react-dom/client";
import AppWithAudio from "./App"; // AppWithAudio already includes AudioProvider and AudioManager instance
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWithAudio />
  </React.StrictMode>
);

// Set document title with Korean martial arts theme
document.title = "흑괘 무술 도장 - Black Trigram Martial Arts";
