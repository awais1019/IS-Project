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
 const { user, is2FAVerified} = useAuthStore();

if (user?.is2FAEnabled && !is2FAVerified) {
  return <Navigate to="/verify-otp" replace />;
}

  if (!user) {
    return <div>Loading...</div>; 
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  
  if (user.role === "user" && !user.verify) {
    return <Navigate to="/verify-otp" replace />;
  }
  



  return <>{children}</>; 
};
