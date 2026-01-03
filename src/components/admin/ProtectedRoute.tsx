import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    // Check for specific Admin UID
    const ADMIN_UID = "1wRwAtKNIYfoHRao9QgWhUEbRVv1";

    if (!user || user.uid !== ADMIN_UID) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
}
