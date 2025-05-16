import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const user = useAuthStore((state) => state.user); 

  if (!user) {
    return <div>Loading...</div>; 
  }


  if (user.role === "user" && !user.verify) {
    return <Navigate to="/verify-otp" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>; 
};
