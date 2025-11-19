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
  
  // Show user-friendly error message
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );

  root.render(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#1a1a1a",
        color: "#FFD700",
        fontFamily: "'Noto Sans KR', 'Malgun Gothic', Arial, sans-serif",
        fontSize: 20,
        textAlign: "center",
        padding: 32,
      }}
      data-testid="layout-engine-error"
    >
      <div style={{ fontWeight: "bold", fontSize: 28, marginBottom: 16 }}>
        흑괘 무술 도장
      </div>
      <div style={{ marginBottom: 12 }}>
        레이아웃 엔진을 불러오지 못했습니다.<br />
        (Failed to load layout engine)
      </div>
      <div style={{ fontSize: 16, color: "#aaa" }}>
        앱을 시작할 수 없습니다. 잠시 후 다시 시도해 주세요.<br />
        (The app cannot start. Please try again later.)
      </div>
    </div>
  );

  document.title = "흑괘 무술 도장 - Error";
});
