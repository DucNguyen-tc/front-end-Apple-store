import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function AdminLayout() {
  return (
    <div className="flex">
      <Sidebar></Sidebar>
      <main className="flex-1 p-6" style={{ marginLeft: 240 }}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
