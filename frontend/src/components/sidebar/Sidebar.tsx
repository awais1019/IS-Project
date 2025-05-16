import { useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import type { SidebarItemProps } from "./SidebarItem";
import SidebarItem from "./SidebarItem";
import { toggle2FAFromBackend } from "../../services/authService";
import { useNavigate } from "react-router";
import Switch from "react-switch";
import { FiShield, FiLogOut } from "react-icons/fi";

type SidebarProps = {
  sidebarLinks: SidebarItemProps[];
};

export default function Sidebar({ sidebarLinks }: SidebarProps) {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const logout = useAuthStore((s) => s.logout);

  const [loading, setLoading] = useState(false);

  const handleToggle2FA = async () => {
    setLoading(true);
    try {
      const data = await toggle2FAFromBackend();
      setAuth(data.token, { ...user!, is2FAEnabled: data.is2FAEnabled });
    } catch (error) {
      console.error("Failed to toggle 2FA:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="bg-white h-full px-4 py-2 rounded-2xl border border-gray-200 shadow-sm w-64 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold text-blue tracking-wide mb-6">
          {user?.role.toUpperCase()} PANEL
        </h1>

        <ul className="space-y-2">
          {sidebarLinks.map((item, index) => (
            <SidebarItem key={index} {...item} />
          ))}
        </ul>
      </div>

      {/* Bottom fixed section */}
      <div className="space-y-4">
        <li className="flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer list-none">
          <div className="flex items-center space-x-2">
            <FiShield className="text-gray-600" size={20} />
            <span>Two-Factor Authentication</span>
          </div>
          <Switch
            onChange={handleToggle2FA}
            checked={user?.is2FAEnabled ?? false}
            disabled={loading}
            offColor="#d1d5db"
            onColor="#3b82f6"
            uncheckedIcon={false}
            checkedIcon={false}
            height={20}
            width={40}
            handleDiameter={18}
            className="cursor-pointer"
          />
        </li>

        <li
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="flex items-center space-x-2 p-2 rounded hover:bg-red-100 cursor-pointer text-red-600 list-none select-none"
          title="Logout"
        >
          <FiLogOut size={20} />
          <span>Logout</span>
        </li>
      </div>
    </aside>
  );
}
