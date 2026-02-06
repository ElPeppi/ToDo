import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./LoginRegister.css";
const API_URL = import.meta.env.VITE_API_URL;

function LoginPage({ setPopup }: { setPopup: Function }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  useEffect(() => {
    document.documentElement.setAttribute("data-page", "login");
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        fetch(`${API_URL}/api/auth/check-token`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${accessToken}` },
        })
          .then(res => res.json())
          .then(data => {
            if (data.valid) {
              navigate("/ToDo");
            } else {
              fetch(`${API_URL}/api/auth/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken: localStorage.getItem("refreshToken") }),
              })
                .then(res => res.json())
                .then(data => {
                  if (data.accessToken) {
                    
                    localStorage.setItem("accessToken", data.accessToken);
                    navigate("/ToDo");
                  } else {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                  }
                });
            }
          });
      } catch (e) {
        console.error(e);
      }
    }
  }, [navigate]);
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("response log",data);
      if (response.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("userId", String(data.user.id));
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("tasksUserInfo", JSON.stringify(data.tasks));
        setPopup({ message: "Login successful!", type: "success" });
        navigate("/ToDo");
      } else {
        setPopup({ message: data.message || "Login failed", type: "error" });
      }
    } catch (error) {
      setPopup({ message: "An error occurred during login", type: "error" });
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
