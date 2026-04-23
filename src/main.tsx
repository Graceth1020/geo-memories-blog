import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// SPA fallback decoder: if we arrived via /404.html with ?p=/path&q=...
// rewrite the URL back to its real path before React Router boots.
(function restoreSpaPath() {
  const url = new URL(window.location.href);
  const p = url.searchParams.get("p");
  if (p !== null) {
    const q = url.searchParams.get("q");
    url.searchParams.delete("p");
    url.searchParams.delete("q");
    const baseEl = document.querySelector("base");
    const base = (baseEl?.getAttribute("href") || "/").replace(/\/$/, "");
    const newUrl =
      window.location.origin +
      base +
      p +
      (q ? "?" + q : "") +
      url.hash;
    window.history.replaceState(null, "", newUrl);
  }
})();

createRoot(document.getElementById("root")!).render(<App />);
