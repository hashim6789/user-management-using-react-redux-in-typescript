import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store/store";

interface AuthenticatedAdminRouteProps {
  children: ReactNode;
}

const AuthenticatedAdminRoute: React.FC<AuthenticatedAdminRouteProps> = ({
  children,
}) => {
  const { adminAuthenticated } = useSelector((state: RootState) => state.auth);
  if (!adminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AuthenticatedAdminRoute;
