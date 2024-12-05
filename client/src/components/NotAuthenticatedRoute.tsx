import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Navigate } from "react-router-dom";

interface NotAuthenticatedRouteProps {
  children: ReactNode;
}

const NotAuthenticatedRoute: React.FC<NotAuthenticatedRouteProps> = ({
  children,
}) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default NotAuthenticatedRoute;
