import { NavLink, useLocation } from "react-router-dom";
import type { IconType } from "react-icons";

export type SidebarItemProps = {
  path: string;
  label: string;
  icon: IconType;
};

export default function SidebarItem({ icon: Icon, label, path }: SidebarItemProps) {
  const location=useLocation();
  const pathname=location.pathname
  console.log(pathname)
  return (
    <li>
      <NavLink
        to={path}
        className={({ isActive }) =>
          `flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 ${
            isActive ? "text-red-800 bg-gray-200 font-semibold" : "text-black font-normal"
          }`
        }
      >
        <Icon className="text-xl" />
        <span className="text-sm">{label}</span>
      </NavLink>
    </li>
  );
}