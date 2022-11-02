import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../contexts/auth.context";

export default function PrivateLayout() {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" />;
}
