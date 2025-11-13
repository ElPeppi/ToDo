import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

import Login from "./pages/loginRegister/Login";
import Register from "./pages/loginRegister/Register";
import ToDo from "./pages/todo/ToDo";
import PageTransition from "./components/PageTransition";
import PopupMessage from "./components/PopupMessage";
import VerifyPage from "./pages/loginRegister/VerifyPage";

// =========================
// RUTAS ANIMADAS
// =========================
function AnimatedRoutes({ setPopup }: { setPopup: Function }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Login setPopup={setPopup} />
            </PageTransition>
          }
        />

        <Route
          path="/register"
          element={
            <PageTransition>
              <Register setPopup={setPopup} />
            </PageTransition>
          }
        />

        <Route
          path="/ToDo"
          element={
            <PageTransition>
              <ToDo setPopup={setPopup} />
            </PageTransition>
          }
        />

        <Route path="/verify" element={<VerifyPage />} />
      </Routes>
    </AnimatePresence>
  );
}

// =========================
// APP PRINCIPAL
// =========================
export default function App() {
  const [popup, setPopup] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  return (
    <Router>
      {/* POPUP GLOBAL - SIEMPRE ACTIVO */}
      {popup && (
        <PopupMessage
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup(null)}
        />
      )}

      {/* ANIMACIONES DE PÁGINA */}
      <AnimatedRoutes setPopup={setPopup} />
    </Router>
  );
}
