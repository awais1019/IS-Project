import SidebarItem, { type SidebarItemProps } from "./SidebarItem"; 


type SidebarProps={
    sidebarLinks:SidebarItemProps[]
}
export default function Sidebar({sidebarLinks}:SidebarProps) {
  return (
    <aside className="bg-white p-10 opacity-90  flex flex-col rounded-[10px] border border-gray-300">
      <h1 className="text-xl font-bold mb-4">Admin Panel</h1>
      <ul className="space-y-2">
        {sidebarLinks.map((item, index) => (
          <SidebarItem key={index}  {...item} />
        ))}
      </ul>
    </aside>
  );
}
