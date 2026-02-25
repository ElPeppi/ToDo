export function initTheme() {
  const saved = localStorage.getItem("theme"); // "light" | "dark" | null
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const theme = saved ?? (systemDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);

  // Si NO hay saved, seguimos al sistema
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (!localStorage.getItem("theme")) {
      document.documentElement.setAttribute("data-theme", systemDark ? "dark" : "light");
    }
  });
}

export function setTheme(theme: "light" | "dark") {
  localStorage.setItem("theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  setTheme(current === "dark" ? "light" : "dark");
}
