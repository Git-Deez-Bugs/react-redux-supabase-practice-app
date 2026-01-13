import { Navigate } from "react-router-dom";
import { useAppSelector } from "./hooks";
import type { JSX } from "react";
import LoadingSpinner from "./components/LoadingSpinner";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {

  const { user, initialized } = useAppSelector(state => state.auth);

  if (!initialized) return <LoadingSpinner />;

  if (!user) return <Navigate to="/signin" replace />

  return children;
}
