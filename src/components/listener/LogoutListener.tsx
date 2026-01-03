import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LogoutListener({ setPopup }: { setPopup: Function }) {
  const navigate = useNavigate();

  useEffect(() => {
    const onLogout = () => {
      setPopup({ message: "Sesión cerrada", type: "success" });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/");
    };

    window.addEventListener("app:logout", onLogout);
    return () => window.removeEventListener("app:logout", onLogout);
  }, [navigate, setPopup]);

  return null;
}
export default LogoutListener;