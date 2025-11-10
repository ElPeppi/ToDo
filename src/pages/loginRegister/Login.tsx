import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./LoginRegister.css";


function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-page", "login");
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("https://lhghdq2r-4000.use.devtunnels.ms/api/auth/login", {
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



  return (
    <>
      <button className="topSwitch" onClick={() => navigate("/register")}>
        Signup →
      </button>

      <div className="authBox">
        <h2>Here you can Login</h2>
        <p>Let's join us :)</p>

        <form onSubmit={handleLogin}>
          <input className="inputLog" type="email" placeholder="Email"
            value={email} onChange={e => setEmail(e.target.value)} />

          <input className="inputLog" type="password" placeholder="Password"
            value={password} onChange={e => setPassword(e.target.value)} />

          <button type="submit">LOGIN</button>
        </form>

      </div>
    </>
  );
}

export default LoginPage;
