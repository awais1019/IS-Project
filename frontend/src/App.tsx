import { Route, Routes } from "react-router-dom";
import React, { Suspense } from "react";
import { customRoute } from "./lib/util";
import DashboardLayout from "./layout/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

const Login = React.lazy(() => import("./components/login/Login"));
const AdminDashboardPage = React.lazy(
  () => import("./pages/AdminDashboardPage")
);
const SignUp = React.lazy(() => import("./components/SignUp"));
const UserDashboard = React.lazy(
  () => import("./components/UserDashboard")
);

export function App() {
  return (
    <>
      <Suspense fallback={<p>LodingBar...</p>}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "student"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {customRoute("admin-home", <AdminDashboardPage />, ["admin"])}
            {customRoute("admin-loading", <p>loadingbar....</p>, ["admin"])}
            {customRoute("user-home", <UserDashboard />, ["user"])}
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
