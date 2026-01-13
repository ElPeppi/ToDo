let socket: WebSocket | null = null;

export function connectWS(token: string) {
  if (socket && socket.readyState === WebSocket.OPEN) return socket;

  socket = new WebSocket(
    `${import.meta.env.VITE_WS_URL}?token=${token}`
  );

  socket.onopen = () => {
    console.log("🟢 WebSocket conectado");
  };

  socket.onclose = () => {
    console.log("🔴 WebSocket cerrado");
  };

  socket.onerror = (e) => {
    console.error("❌ WS error", e);
  };

  // 🔥 ESTA ES LA PARTE CLAVE
  socket.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data);
      console.log("📨 WS message:", msg);

      // 👉 Evento global para toda la app
      window.dispatchEvent(
        new CustomEvent("app:ws-message", { detail: msg })
      );
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
  if (socket) {
    socket.close();
    socket = null;
  }
}
