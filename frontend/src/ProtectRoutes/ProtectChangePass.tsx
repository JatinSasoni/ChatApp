import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

const ProtectChangePass: React.FC<Props> = ({ children }) => {
  const otpVerified = sessionStorage.getItem("otpVerified");
  return otpVerified ? children : <Navigate to="/login" />;
};

export default ProtectChangePass;
