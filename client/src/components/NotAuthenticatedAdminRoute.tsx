import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Navigate } from "react-router-dom";

interface NotAuthenticatedAdminRouteProps {
  children: ReactNode;
}

const NotAuthenticatedAdminRoute: React.FC<NotAuthenticatedAdminRouteProps> = ({
  children,
}) => {
  const { adminAuthenticated } = useSelector((state: RootState) => state.auth);
  if (adminAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default NotAuthenticatedAdminRoute;
