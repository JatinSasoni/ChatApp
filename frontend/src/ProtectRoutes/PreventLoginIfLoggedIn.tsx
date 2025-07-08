import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { Navigate } from "react-router-dom";

type props = {
  children: React.ReactNode;
};

const PreventLogin: React.FC<props> = ({ children }) => {
  const { loggedInUser } = useSelector((state: RootState) => state.auth);

  if (loggedInUser) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PreventLogin;
