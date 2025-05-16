import type { SidebarItemProps } from "./SidebarItem";
import SidebarItem from "./SidebarItem";

type SidebarProps = {
  sidebarLinks: SidebarItemProps[];
};

export default function Sidebar({ sidebarLinks }: SidebarProps) {
  return (
    <aside className="bg-white h-full p-6 rounded-2xl border border-gray-200 shadow-sm w-64">
      <h1 className="text-2xl font-bold text-orange-500 mb-6 tracking-wide">
        Admin Panel
      </h1>

      <ul className="space-y-2">
        {sidebarLinks.map((item, index) => (
          <SidebarItem key={index} {...item} />
        ))}
      </ul>
    </aside>
  );
}
