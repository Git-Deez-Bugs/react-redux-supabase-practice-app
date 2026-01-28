import { supabase } from "./lib/supabase";
import { useAppDispatch } from "./hooks";
import { setUser } from "./features/auth/authSlice";
import { useEffect } from "react";

export default function AuthListener() {

  const dispatch = useAppDispatch();

  useEffect(() => {
    const { data: { subscription }} = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setUser(session?.user));
    });

    return () => subscription.unsubscribe();
  }, [dispatch])

  return null;
}