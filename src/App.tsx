import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute.tsx";
import { AuthPage } from "./pages/Auth.tsx";
import { MFD001 } from "./pages/MFD001.tsx";
import OperablePartition from "./pages/Operable.tsx";
import GlassPartition from "./pages/Glass.tsx";
import { Home } from "./pages/Home.tsx";
import { NotFoundPage } from "./pages/NotFound.tsx";

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
      <Route
        path="/operable"
        element={
          <ProtectedRoute>
            <OperablePartition />
          </ProtectedRoute>
        }
      />
      <Route
        path="/glass"
        element={
          <ProtectedRoute>
            <GlassPartition />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
