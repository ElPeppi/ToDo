import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/login/LoginRegister.css";

function LoginRegister() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordR, setPasswordR] = useState("");
  const [emailR, setEmailR] = useState("");
  const [fullName, setFullName] = useState("");

  // 🟢 Verificar sesión activa o refrescar token
  useEffect(() => {
    const verificarSesion = async () => {
      const token = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!token) return; // no hay sesión previa

      // Intentar verificar token
      const response = await fetch("http://localhost:4000/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        console.log("✅ Sesión válida, redirigiendo...");
        navigate("/ToDo");
      } else if (refreshToken) {
        // Intentar refrescar token si el actual expiró
        const refreshRes = await fetch("http://localhost:4000/api/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: refreshToken }),
        });

        if (refreshRes.ok) {
          const newData = await refreshRes.json();
          localStorage.setItem("accessToken", newData.accessToken);
          console.log("♻️ Token renovado, redirigiendo...");
          navigate("/ToDo");
        } else {
          console.log("⚠️ Tokens expirados, el usuario debe volver a loguearse");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
    };

    verificarSesion();
  }, [navigate]);

  // 🟣 LOGIN
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        console.log("✅ Inicio de sesión exitoso");
        navigate("/ToDo");
      } else {
        console.error("❌ Error en login:", data.message);
      }
    } catch (error) {
      console.error("⚠️ Error al hacer login:", error);
    }
  };

  // 🟣 REGISTER
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email: emailR,
          password: passwordR,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("✅ Registro exitoso:", data);
        navigate("/");
      } else {
        console.error("❌ Error en registro:", data.message);
      }
    } catch (error) {
      console.error("⚠️ Error al registrar:", error);
    }
  };

  return (
    <div className="logContainer">
      <div className="cards">
        <div className="login containers">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <h5>Email</h5>
            <input
              className="inputLog"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <h5>Password</h5>
            <input
              className="inputLog"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
        </div>

        <div className="register containers">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <h5>Nombre Completo</h5>
            <input
              className="inputLog"
              type="text"
              placeholder="Nombre Completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <h5>Email</h5>
            <input
              className="inputLog"
              type="email"
              placeholder="Email"
              value={emailR}
              onChange={(e) => setEmailR(e.target.value)}
            />
            <h5>Password</h5>
            <input
              className="inputLog"
              type="password"
              placeholder="Password"
              value={passwordR}
              onChange={(e) => setPasswordR(e.target.value)}
            />
            <button>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginRegister;
