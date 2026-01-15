import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "./hooks";
import NavBar from "./components/NavBar";
import LoadingSpinner from "./components/LoadingSpinner";

export default function ProtectedLayout() {

  const { user, initialized } = useAppSelector(state => state.auth);

  if (!initialized) return <div className="min-h-screen w-full flex justify-center items-center"><LoadingSpinner /></div>;

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="">
      <NavBar />
      <Outlet />
    </div>
  );
}
