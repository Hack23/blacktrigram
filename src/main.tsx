import React from "react";
import ReactDOM from "react-dom/client";
import { extend } from "@pixi/react";
import {
  Container,
  Graphics,
  Text,
  Sprite,
  AnimatedSprite,
  TilingSprite,
  NineSliceSprite,
} from "pixi.js";
import App from "./App";
import "./index.css";
import "./components/ui/base/PixiComponents"; // Ensure PIXI components are extended

// Extend @pixi/react with necessary PIXI components
extend({
  Container,
  Graphics,
  Text,
  Sprite,
  AnimatedSprite,
  TilingSprite,
  NineSliceSprite,
});

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Add Korean font loading
const koreanFontLink = document.createElement("link");
koreanFontLink.href =
  "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap";
koreanFontLink.rel = "stylesheet";
document.head.appendChild(koreanFontLink);

// Set document title with Korean martial arts theme
document.title = "흑괘 무술 도장 - Black Trigram Martial Arts";
