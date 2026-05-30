import { Navigate, Outlet } from 'react-router';

export default function RoleProtectedRoute({
  requiredRole,
  userRole,
}: Readonly<{
  requiredRole: string;
  userRole?: string;
}>) {
  if (!userRole || userRole !== requiredRole) {
    return (
      <Navigate
        to="/error-page/Non sei autorizzato ad accedere a questa pagina"
        replace
      />
    );
  }
  return <Outlet />;
}
