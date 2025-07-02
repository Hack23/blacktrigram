// 🔧 CRITICAL: Import pixiExtensions FIRST to ensure Node polyfill is available
import "./utils/pixiExtensions";

// Polyfill Node for @pixi/layout (required for browser + Vite)
if (typeof globalThis !== "undefined" && !("Node" in globalThis)) {
  (globalThis as any).Node = class Node {
    static ELEMENT_NODE = 1;
    static TEXT_NODE = 3;
    static DOCUMENT_NODE = 9;
    nodeType = 1;
    parentNode: any = null;
    childNodes: any[] = [];
    constructor() {}
    appendChild(child: any) {
      this.childNodes.push(child);
      child.parentNode = this;
    }
    removeChild(child: any) {
      const index = this.childNodes.indexOf(child);
      if (index > -1) {
        this.childNodes.splice(index, 1);
        child.parentNode = null;
      }
    }
  };
}

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
