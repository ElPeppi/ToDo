import { useNavigate } from "react-router-dom";
import { useState } from "react";


function LoginRegister(){
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        if(email === "admin@example.com" && password === "password") {
            navigate("/ToDo");
        } else {
            alert("Invalid credentials");
        }
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordR, setPasswordR] = useState("");
    const [emailR, setEmailR] = useState("");
    const [nombres, setNombres] = useState("");
    const [apellidos, setAppellidos] = useState("");
    const [age, setAge] = useState("");
    const [numero, setNumero] = useState("");
    return(
    <div className="logContainer">
        <div className="login" style={{border:"1px solid black", padding: "20px"}}>
            <h2>Login</h2>

            <h5>Email</h5>
            <form action="" onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <h5>Password</h5>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
        </div>
        <div className="register" style={{border:"1px solid black", padding: "20px"}}>
            <h2>Register</h2>
            
            <h5>Nombres</h5>
            <input type="text" placeholder="Nombres" value={nombres} onChange={(e) => setNombres(e.target.value)} />
            <h5>Apellidos</h5>
            <input type="text" placeholder="Apellidos" value={apellidos} onChange={(e) => setAppellidos(e.target.value)} />
            <h5>Edad</h5>
            <input type="number" placeholder="Edad" value={age} onChange={(e) => setAge(e.target.value)} />
            <h5>Numero</h5>
            <input type="number" placeholder="Numero" value={numero} onChange={(e) => setNumero(e.target.value)} />
            <h5>Email</h5>
            <input type="email" placeholder="Email" value={emailR} onChange={(e) => setEmailR(e.target.value)} />
            <h5>Password</h5>
            <input type="password" placeholder="Password" value={passwordR} onChange={(e) => setPasswordR(e.target.value)} />

        </div>
    </div>
    )
}

export default LoginRegister;