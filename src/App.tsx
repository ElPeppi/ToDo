import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Login from "./pages/loginRegister/Login";
import Register from "./pages/loginRegister/Register";
import ToDo from "./pages/todo/ToDo";
import PageTransition from "./components/PageTransition";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition><Login /></PageTransition>
        } />

        <Route path="/register" element={
          <PageTransition><Register /></PageTransition>
        } />

        <Route path="/ToDo" element={
          <PageTransition><ToDo /></PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}
