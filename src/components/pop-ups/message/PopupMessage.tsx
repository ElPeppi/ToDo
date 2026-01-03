import React, { useEffect } from "react";
import "./popupMessage.css";

interface PopupMessageProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

const PopupMessage: React.FC<PopupMessageProps> = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000); // se cierra automáticamente
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`popup-message ${type}`}>
      <p>{message}</p>
      <button onClick={onClose} className="close-btn">×</button>
    </div>
  );
};

export default PopupMessage;
