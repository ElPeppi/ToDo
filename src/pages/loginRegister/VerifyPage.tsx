import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

export default function VerifyPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    if (!token) return;

    fetch(`${API_URL}/api/auth/verify?token=${token}`)
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        navigate("/"); // redirigir al login después
      })
      .catch(() => {
        alert("Error verificando correo.");
        
      });
  }, [location, navigate]);

  return <h2 style={{ color: "white" }}>Verificando tu cuenta...</h2>;
}
