import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AudioProvider } from "./audio/AudioProvider";
import "./index.css";

// Initialize yoga layout engine for @pixi/layout
import { loadYoga } from "yoga-layout/load";
import { setYoga } from "@pixi/layout";

// Load yoga asynchronously before rendering
loadYoga().then((yoga) => {
  setYoga(yoga);
  
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
}).catch((error) => {
  console.error("Failed to load yoga layout engine:", error);
  // Fallback: render without layout support
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

  document.title = "흑괘 무술 도장 - Black Trigram Martial Arts";
});
