import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./design.css";
import "./polish.css";
import "./final.css";
import "./learning.css";
import "./evi.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}


