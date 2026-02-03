import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

import Login from "./pages/loginRegister/Login";
import Register from "./pages/loginRegister/Register";
import ToDo from "./pages/todo/ToDo";
import Groups from "./pages/groups/Groups";
import Settings from "./pages/settings/Settings";
import Porfile from "./pages/porfile/Porfile";
import PageTransition from "./components/PageTransition";
import PopupMessage from "./components/pop-ups/message/PopupMessage";
import VerifyPage from "./pages/loginRegister/VerifyPage";
import LogoutListener from "./components/listener/LogoutListener";



// =========================
// RUTAS ANIMADAS
// =========================
import AppLayout from "./layout/AppLayout";
import Calendar from "./pages/calendar/Calendar";

function AnimatedRoutes({ setPopup }: { setPopup: Function }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* SIN MENÚ */}
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

        <Route path="/verify" element={<VerifyPage />} />

        {/* CON MENÚ (layout) */}
        <Route element={<AppLayout />}>
          <Route
            path="/todo"
            element={
              <PageTransition>
                <ToDo setPopup={setPopup} />
              </PageTransition>
            }
          />

          <Route
            path="/groups"
            element={
              <PageTransition>
                <Groups setPopup={setPopup} />
              </PageTransition>
            }
          />
          <Route
            path="/calendar"
            element={
              <PageTransition>
                <Calendar setPopup={setPopup} />
              </PageTransition>
            }
            />
            <Route
            path="/porfile"
            element={
              <PageTransition>
                <Porfile setPopup={setPopup} />
              </PageTransition>
            }
          />
          <Route
            path="/settings"
            element={
              <PageTransition>
                <Settings setPopup={setPopup} />
              </PageTransition>
            }
          />
        </Route>
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
       <LogoutListener setPopup={setPopup} /> {/* ✅ aquí */}
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
