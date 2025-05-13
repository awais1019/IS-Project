import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/Header";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Bs0Circle, BsHouse, BsPeople } from "react-icons/bs";
import { useAuthStore } from "../stores/useAuthStore";

const AdminSidebarLinks = [
  { label: "Dashboard", path: "admin-home", icon: Bs0Circle },
  { label: "Home", path: "/dashboard/admin-loading", icon: BsHouse },
  { label: "Users", path: "/dashboard/admins", icon: BsPeople },
];
const StudentSidebarLinks = [
  { label: "Dashboard", path: "/dashboard/student-home", icon: Bs0Circle },
  { label: "Home", path: "admin", icon: BsHouse },
  { label: "Student", path: "admin", icon: BsPeople },
];

export default function DashboardLayout() {
   
  const role = useAuthStore((s) => s.role);
  const sidebarLinks =
    role === "admin" ? AdminSidebarLinks : StudentSidebarLinks;
    const location = useLocation();
  const isAtRoot = location.pathname === "/dashboard";
  const path=role==="admin"? "admin-home" : "student-home"
  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-[10px] h-screen w-screen">
      <Sidebar sidebarLinks={sidebarLinks} />
      <main>
        <Header />
        {isAtRoot ?  <Navigate to={path} replace /> :   <Outlet /> }
     
      </main>
    </div>
  );
}
