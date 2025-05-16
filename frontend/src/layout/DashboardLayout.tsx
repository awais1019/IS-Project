import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/Header";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Bs0Circle, BsHouse, BsPeople } from "react-icons/bs";
import { useAuthStore } from "../stores/useAuthStore";
import { FaBrain } from "react-icons/fa";
import { MdHistory } from "react-icons/md";
const AdminSidebarLinks = [
  { label: "Analyze", path: "admin-home", icon: FaBrain },
  { label: "Users", path: "/dashboard/admin-loading", icon: BsPeople },
];
const StudentSidebarLinks = [
  { label: "Analyze", path: "/dashboard/user-home", icon: FaBrain },
  { label: "History", path: "/dashboard/user-history", icon: MdHistory },
]

export default function DashboardLayout() {
   
  const user = useAuthStore((s) => s.user);
  const sidebarLinks =
    user?.role === "admin" ? AdminSidebarLinks : StudentSidebarLinks;
    const location = useLocation();
  const isAtRoot = location.pathname === "/dashboard";
  const path=user?.role==="admin"? "admin-home" : "user-home"
  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-[3px] h-screen w-screen">
      <Sidebar  sidebarLinks={sidebarLinks} />
      <main>
        <Header user={user} />
        {isAtRoot ?  <Navigate to={path} replace /> :   <Outlet /> }
     
      </main>
    </div>
  );
}
