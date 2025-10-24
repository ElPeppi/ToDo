import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/login/LoginRegister.css";


function LoginRegister() {
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:4000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();
            console.log(data);

            // ejemplo: redirigir si el login fue exitoso
            if (response.ok) {
                localStorage.setItem("token", data.token);
                
                navigate("/ToDo");
                console.log("Inicio de sesión exitoso:", data);
            } else {
                console.error("Error en login:", data.message);
            }
        } catch (error) {
            console.error("Error al hacer login:", error);
        }
    };

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordR, setPasswordR] = useState("");
    const [emailR, setEmailR] = useState("");
    const [fullName, setfullName] = useState("");

    return (
        <div className="logContainer">
            <div className="login containers">
                <h2>Login</h2>

                <h5>Email</h5>
                <form action="" onSubmit={handleLogin}>
                    <input className="inputLog" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <h5>Password</h5>
                    <input className="inputLog" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit">Login</button>
                </form>
            </div>
            <div className="register containers" >
                <h2>Register</h2>

                <h5>Nombre Completo</h5>
                <input className="inputLog" type="text" placeholder="Nombre Completo" value={fullName} onChange={(e) => setfullName(e.target.value)} />
                <h5>Email</h5>
                <input className="inputLog" type="email" placeholder="Email" value={emailR} onChange={(e) => setEmailR(e.target.value)} />
                <h5>Password</h5>
                <input className="inputLog" type="password" placeholder="Password" value={passwordR} onChange={(e) => setPasswordR(e.target.value)} />

            </div>
        </div>
    )
}

export default LoginRegister;