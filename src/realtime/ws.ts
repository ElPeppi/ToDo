let socket: WebSocket | null = null;
let pingInterval: number | null = null;

export function connectWS(token: string) {
  // si ya está abierto, reusa
  if (socket && socket.readyState === WebSocket.OPEN) return socket;

  // si existe pero quedó medio muerto, ciérralo antes de recrear
  if (socket && socket.readyState !== WebSocket.CLOSED) {
    try { socket.close(); } catch {}
  }

  socket = new WebSocket(`${import.meta.env.VITE_WS_URL}?token=${encodeURIComponent(token)}`);

  socket.onopen = () => {
    console.log("🟢 WebSocket conectado");

    // ✅ (1) PING cada 30s para mantener viva la conexión / renovar TTL
    if (pingInterval) {
      clearInterval(pingInterval);
      pingInterval = null;
    }

    pingInterval = window.setInterval(() => {
      if (!socket) return;

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "ping" }));
        // opcional: si no quieres spam, comenta este log
        // console.log("📡 WS ping");
      }
    }, 30_000);
  };

  socket.onclose = (e) => {
    console.log("🔴 WebSocket cerrado", e.code, e.reason);

    // ✅ (2) limpia el ping
    if (pingInterval) {
      clearInterval(pingInterval);
      pingInterval = null;
    }
  };

  socket.onerror = (e) => {
    console.error("❌ WS error", e);
  };

  socket.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data);
      console.log("📨 WS message:", msg);

      window.dispatchEvent(new CustomEvent("app:ws-message", { detail: msg }));
    } catch (err) {
      console.error("WS message parse error", err);
    }
  };

  return socket;
}

export function getWS() {
  return socket;
}

export function closeWS() {
  // ✅ (3) limpia ping también al cerrar manualmente
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }

  if (socket) {
    try { socket.close(); } catch {}
    socket = null;
  }
}
