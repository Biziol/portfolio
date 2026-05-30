import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute({
  isAuthenticated,
  isLoading,
}: Readonly<{
  isAuthenticated: boolean;
  isLoading: boolean;
}>) {
  if (isLoading) return <div>Loading...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
