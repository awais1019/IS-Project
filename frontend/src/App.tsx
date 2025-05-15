import { Route, Routes } from "react-router-dom";
import React, { Suspense } from "react";
import { customRoute } from "./lib/util";
import DashboardLayout from "./layout/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./components/login/Login";
import { TwoFactorForm } from "./2fa";
// import {TwoFactorForm} from "./2fa";


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
          {customRoute("/2fa", <TwoFactorForm />, ["user"])}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "user"]}>
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
