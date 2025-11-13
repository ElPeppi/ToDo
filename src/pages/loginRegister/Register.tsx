import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./LoginRegister.css";

function RegisterPage({setPopup}: {setPopup:Function}) {
    const navigate = useNavigate();
    const [emailR, setEmailR] = useState("");
    const [passwordR, setPasswordR] = useState("");
    const [nameR, setNameR] = useState("");
    useEffect(() => {
        document.documentElement.setAttribute("data-page", "register");
    }, []);

    // 🟣 REGISTER
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch("https://lhghdq2r-4000.use.devtunnels.ms/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: nameR,
                    email: emailR,
                    password: passwordR,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setPopup({ message: "✅ Registro exitoso! Por favor, verifica tu email.", type: "success" });
                navigate("/");
            } else {
                setPopup({ message: data.message || "Error en registro", type: "error" });
            }
        } catch (error) {
            setPopup({ message: "Error al registrar", type: "error" });
        }
    };

    return (
        <>
            <button className="topSwitch" onClick={() => navigate("/")}>
                Login →
            </button>

            <div className="authBox">
                <h2>Create an account</h2>
                <p>Welcome! Just a few steps :)</p>

                <form onSubmit={handleRegister}>
                    <input className="inputLog" type="text" placeholder="Name"
                        value={nameR} onChange={e => setNameR(e.target.value)} />

                    <input className="inputLog" type="email" placeholder="Email"
                        value={emailR} onChange={e => setEmailR(e.target.value)} />

                    <input className="inputLog" type="password" placeholder="Password"
                        value={passwordR} onChange={e => setPasswordR(e.target.value)} />

                    <button type="submit">REGISTER</button>
                </form>
            </div>
        </>
    );
}

export default RegisterPage;
