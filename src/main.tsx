// Import pixiExtensions first to ensure Node polyfill is available
import "./utils/pixiExtensions";

import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import App from "./App";
import { AudioProvider } from "./audio/AudioProvider";
import "./index.css";

// Custom fallback component for error handling
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="error-container">
      <h2>Problem load black trigram:</h2>
      <pre>{error.message}</pre>
      <button onClick={() => window.location.reload()}>Try again</button>
    </div>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <AudioProvider>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <App />
      </ErrorBoundary>
    </AudioProvider>
  </React.StrictMode>
);

// Set document title with Korean martial arts theme
document.title = "흑괘 무술 도장 - Black Trigram Martial Arts";
