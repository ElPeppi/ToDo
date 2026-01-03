import { Outlet } from "react-router-dom";
import Menu from "../components/header/menu/Menu";

function AppLayout() {
  return (
    <div className="app-layout">
      <Menu />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
