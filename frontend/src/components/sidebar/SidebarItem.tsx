import { NavLink} from "react-router-dom";
import type { IconType } from "react-icons";

export type SidebarItemProps = {
  path: string;
  label: string;
  icon: IconType;
};

export default function SidebarItem({ icon: Icon, label, path }: SidebarItemProps) {


  return (
    <li>
      <NavLink
        to={path}
        className={({ isActive }) =>
          `flex items-center gap-3 px-2 py-2 rounded-lg transition-colors duration-200 ${
            isActive
              ? "bg-orange-100 text-orange-600 font-semibold shadow-inner"
              : "text-gray-700 hover:bg-gray-100"
          }`
        }
      >
        <Icon className="text-lg" />
        <span className="text-sm tracking-wide">{label}</span>
      </NavLink>
    </li>
  );
}
