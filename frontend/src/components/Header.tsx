import { FaBrain } from "react-icons/fa";
import type { User } from "../stores/useAuthStore";

type HeaderProps = {
  user: User | null;
};

export default function Header({ user }: HeaderProps) {
  return (
    <header className="flex items-center rounded-[10px] justify-between px-6 py-4 bg-white shadow-md border-b border-gray-200">
 
      <div className="flex items-center gap-2">
        <FaBrain className="text-2xl text-blue" />
        <span className="text-xl font-semibold text-gray-800">SentimentPulse</span>
      </div>


      <div className="flex items-center gap-3">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-orange-400 shadow-sm"
        />

        <div className="flex flex-col text-right">
          <p className="text-sm font-medium text-gray-800">
            {user?.name ?? "Guest"}
          </p>
          {user && (
            <>
              <p className="text-xs text-gray-500">{user.email}</p>
              <p className="text-xs text-blue font-semibold capitalize">
                {user.role}
              </p>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
