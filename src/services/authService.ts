const API_URL = "https://ckx45bj88h.execute-api.us-east-1.amazonaws.com";

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.dispatchEvent(new Event("app:logout"));
};

const buildHeaders = (base: RequestInit["headers"], accessToken: string) => ({
  ...(base || {}),
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
});

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken) throw new Error("No hay token activo");

  options.headers = buildHeaders(options.headers, accessToken);

  let response = await fetch(`${API_URL}${endpoint}`, options);

  if ((response.status === 401 || response.status === 403) && refreshToken) {
    const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: refreshToken }),
    });

    if (!refreshRes.ok) {
      logout();
      throw new Error("Sesión expirada");
    }

    const data = await refreshRes.json();
    if (!data?.accessToken) throw new Error("Refresh no devolvió accessToken");

    accessToken = data.accessToken;
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    window.dispatchEvent(new Event("app:token-refreshed"));

    // 🔥 IMPORTANTE: vuelve a poner headers completos, no solo Authorization
    if (accessToken) options.headers = buildHeaders(options.headers, accessToken);

    response = await fetch(`${API_URL}${endpoint}`, options);
  }

  return response;
};
