import { Route } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";


export const customRoute = (
  path: string,
  element: React.ReactNode,
  allowedRoles: string[]
) => (
  <Route
    path={path}
    element={
      <ProtectedRoute allowedRoles={allowedRoles}>{element}</ProtectedRoute>
    }
  />
);

// export function getErrorMessage(error: unknown): string {
//    if (typeof error === "string") return error;
//   if (error instanceof Error) {
//     if (error instanceof FirebaseError) {
     
//       switch (error.code) {
//          case "auth/email-already-in-use":
//           return "email already exits.";
//         case "auth/user-not-found":
//           return "No user found with this email.";
//         case "auth/wrong-password":
//           return "Incorrect password.";
//         case "auth/invalid-email":
//           return "Invalid email address.";
//         case "auth/invalid-credential":
//           return "Invalid credentials.";
//         case "auth/too-many-requests":
//           return "Too many attempts. Try again later.";
//         case "auth/network-request-failed":
//           return "Check your internet connection.";
//         default:
//           return error.message;
//       }
//     } else {
//       return error.message;
//     }
//   } else {
//     return "An unknown error occurred.";
//   }
// }
