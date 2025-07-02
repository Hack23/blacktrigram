// 🔧 CRITICAL: Import pixiExtensions FIRST to ensure polyfills and extensions are loaded.
import "./utils/pixiExtensions";

import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import App from "./App";
import { AudioProvider } from "./audio/AudioProvider";
import "./index.css";

// Enhanced error fallback component with Korean support
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div
      className="error-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#0a0a0f",
        color: "#ffffff",
        fontFamily: "Noto Sans KR, sans-serif",
        padding: "20px",
      }}
    >
      <h2 style={{ color: "#ff6b6b", marginBottom: "20px" }}>
        흑괘 로딩 오류 - Black Trigram Loading Error
      </h2>
      <pre
        style={{
          backgroundColor: "#1a1a1a",
          padding: "15px",
          borderRadius: "8px",
          maxWidth: "80%",
          overflow: "auto",
          fontSize: "12px",
        }}
      >
        {error.message}
      </pre>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#00ffff",
          color: "#000000",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontFamily: "Noto Sans KR, sans-serif",
        }}
      >
        다시 시도 - Try Again
      </button>
    </div>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AudioProvider>
        <App />
      </AudioProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Set document title with Korean martial arts theme
document.title = "흑괘 무술 도장 - Black Trigram Martial Arts";
