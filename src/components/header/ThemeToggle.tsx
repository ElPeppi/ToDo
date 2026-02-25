import { useEffect, useState } from "react";
import { toggleTheme } from "../../utils/theme";
import "./themeToggle.css";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>(() => document.documentElement.getAttribute("data-theme") ?? "light");

  useEffect(() => {
    // por si cambias tema desde otro lado
    const obs = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme") ?? "light");
    });

    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="theme-switch-container">
      <label className="theme-slider" htmlFor="checkbox">
        <input type="checkbox" id="checkbox" />
        <div className="round slider" onClick={() => {
          toggleTheme();
          setTheme(document.documentElement.getAttribute("data-theme") ?? "light");
        }}></div>
      </label>
      <p>tema: {theme}</p>
    </div>
  );
}
