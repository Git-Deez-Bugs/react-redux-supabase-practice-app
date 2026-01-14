import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "./hooks";
import NavBar from "./components/NavBar";
import LoadingSpinner from "./components/LoadingSpinner";

export default function ProtectedLayout() {

  const { user, initialized } = useAppSelector(state => state.auth);

  if (!initialized) return <LoadingSpinner />;

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="relative flex justify-center items-center">
      <NavBar />
      <Outlet />
    </div>
  );
}
