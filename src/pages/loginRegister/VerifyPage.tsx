import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    if (!token) return;

    fetch(`https://lhghdq2r-5173.use.devtunnels.ms/api/auth/verify?token=${token}`)
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
