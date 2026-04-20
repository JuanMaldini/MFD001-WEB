import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute.tsx";
import { AuthPage } from "./pages/Auth.tsx";
import { MFD001 } from "./pages/MFD001.tsx";
import { Home } from "./pages/Home.tsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/mfd001"
        element={
          <ProtectedRoute>
            <MFD001 />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
