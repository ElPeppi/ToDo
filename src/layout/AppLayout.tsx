import { Outlet } from "react-router-dom";
import Menu from "../components/header/menu/Menu";
import { useEffect } from "react";
import { connectWS, closeWS } from "../realtime/ws";

function AppLayout() {
  // Conecta WS una vez cuando entras al layout
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) connectWS(token);
  }, []);

  // Si refrescas token, reconecta (opcional, pero ok)
  useEffect(() => {
    const reconnect = () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      closeWS();       // aquí SÍ tiene sentido
      connectWS(token);
    };

    window.addEventListener("app:token-refreshed", reconnect);
    return () => window.removeEventListener("app:token-refreshed", reconnect);
  }, []);

  return (
    <div className="app-layout">
      <Menu />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
