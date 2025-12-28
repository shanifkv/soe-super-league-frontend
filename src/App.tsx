import { Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Teams from "./pages/Teams";
import Fixtures from "./pages/Fixtures";
import Standings from "./pages/Standings";
import { AuthProvider } from "./context/AuthContext";
import AdminLayout from "./components/admin/AdminLayout";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import MatchControl from "./pages/admin/MatchControl";
import { Navigate } from "react-router-dom";

// Layout for public pages (with Header)
const PublicLayout = () => (
  <>
    <Header />
    {/* Offset for fixed header */}
    <div className="pt-16">
      <Outlet />
    </div>
  </>
);

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/fixtures" element={<Fixtures />} />
          <Route path="/standings" element={<Standings />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="match/:id" element={<MatchControl />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
