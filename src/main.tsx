import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AudioProvider } from "./audio/AudioProvider";
import "./index.css";

// Render the app directly using React and Three.js
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <AudioProvider>
      <App />
    </AudioProvider>
  </React.StrictMode>
);

// Set document title with Korean martial arts theme
document.title = "흑괘 무술 도장 - Black Trigram Martial Arts";
