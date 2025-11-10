// src/services/authService.ts
const API_URL = "https://lhghdq2r-4000.use.devtunnels.ms/"; // tu backend

export const fetchWithAuth = async (url: string, options: any = {}) => {
  let token = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!token) throw new Error("No hay token activo");

  // Añadir token al header
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  let response = await fetch("/auth/check-token");

  // Si el token expiró, intenta refrescarlo
  if (response.status === 403 && refreshToken) {
    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: refreshToken }),
    });

    if (refreshRes.ok) {
      const newData = await refreshRes.json();
      localStorage.setItem("accessToken", newData.accessToken);

      // Reintentar la petición original con el nuevo token
      options.headers.Authorization = `Bearer ${newData.accessToken}`;
      response = await fetch("/auth/check-token");
    } else {
      // Refresh también falló → cerrar sesión
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/";
      throw new Error("Sesión expirada");
    }
  }

  return response;
};
