import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../loginRegister/LoginRegister.css";

function LoginRegister() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordR, setPasswordR] = useState("");
  const [emailR, setEmailR] = useState("");
  const [flipped, setFlipped] = useState(false);
  // 🟢 Verificar sesión activa o refrescar token
  useEffect(() => {
    const verificarSesion = async () => {
      const token = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!token) return;

      const response = await fetch("http://localhost:4000/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        navigate("/ToDo");
      } else if (refreshToken) {
        const refreshRes = await fetch("http://localhost:4000/api/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: refreshToken }),
        });

        if (refreshRes.ok) {
          const newData = await refreshRes.json();
          localStorage.setItem("accessToken", newData.accessToken);
          navigate("/ToDo");
        } else {
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
          name: null,
          email: emailR,
          password: passwordR,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("✅ Registro exitoso:", data);
      } else {
        console.error("❌ Error en registro:", data.message);
      }
    } catch (error) {
      console.error("⚠️ Error al registrar:", error);
    }
  };

  return (
    <div>
      <button className="topSwitch" onClick={() => setFlipped(!flipped)}>
        {flipped ? "Login →" : "Signup →"}
      </button>
      <div className="authWrapper">
        <div className={`sliderContainer ${flipped ? "slide" : ""}`}>
          <div className="formBox">
            <h2>Here you can Login</h2>
            <p>Let's join us :)</p>
            <form onSubmit={handleLogin}>
              <label>Email</label>
              <input className="inputLog" type="email" value={email}
                placeholder="Email" onChange={e => setEmail(e.target.value)} />

              <label>Password</label>
              <input className="inputLog" type="password" value={password}
                placeholder="Password" onChange={e => setPassword(e.target.value)} />

              <button type="submit">LOGIN</button>
            </form>
          </div>

          {/* REGISTER FORM */}
          <div className="formBox">
            <h2>Create an account</h2>
            <p>Welcome! Just a few steps :)</p>
            <form onSubmit={handleRegister}>
              <label>Email</label>
              <input className="inputLog" type="email" value={emailR}
                placeholder="Email" onChange={e => setEmailR(e.target.value)} />

              <label>Password</label>
              <input className="inputLog" type="password" value={passwordR}
                placeholder="Password" onChange={e => setPasswordR(e.target.value)} />

              <button type="submit">REGISTER</button>
            </form>
          </div>

        </div>
      </div>
    </div>

  );

}

export default LoginRegister;
