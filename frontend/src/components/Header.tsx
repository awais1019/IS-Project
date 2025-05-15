import type { User } from "../stores/useAuthStore";


type HeaderProps={
  user:User | null;
}


export default function Header({user}:HeaderProps) {
  return (
 <header className="flex items-center justify-between p-4 bg-white shadow-md">
 
  <p className="text-xl font-semibold text-orange-500">Icon</p>

  <div className="flex items-center gap-3">
    <img 
      src="https://via.placeholder.com/40" 
      alt="User Avatar" 
      className="w-10 h-10 rounded-full object-cover border"
    />
    <p className="text-sm text-gray-700 font-medium">{user?.name}</p>
  </div>
</header>

  )
}