import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function HomeRouteGuard({ children }) {
  const { isAuthenticated, userRole } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("isauth", isAuthenticated);
    if (isAuthenticated && userRole === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } /*  else if (!isAuthenticated) {
      navigate("/", { replace: true });
    } */
  }, [isAuthenticated, userRole, navigate]);

  //only render children if not admin
  if (isAuthenticated && userRole === "admin") return null;
  return children;
}
