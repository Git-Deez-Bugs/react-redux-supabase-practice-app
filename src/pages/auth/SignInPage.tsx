import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { signInUser } from "../../features/auth/authSlice";

export default function SignInPage() {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useAppSelector(state => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(signInUser({ email, password })).unwrap();
    } catch {
      //wala
    }
  }

  return (
    <main className="h-screen w-full flex flex-col justify-center items-center bg-gray-100">
      <form onSubmit={handleSignUp} className="p-10 bg-white flex flex-col justify-center items-start gap-5 rounded-2xl drop-shadow-xl">
        <h2 className="font-bold text-3xl w-full text-center mb-5">Sign In</h2>
        <label>Email:</label>
        <input type="text" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="johndoe@email.com" className="bg-gray-100 border border-gray-300 rounded-md p-4 w-90"/>
        <label>Password:</label>
        <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="password" className="bg-gray-100 border border-gray-300 rounded-md p-4 w-90"/>
        <button disabled={ loading || !email || !password } className="bg-blue-500 p-4 w-full rounded-md text-white text-center mt-5 disabled:bg-gray-500 disabled:cursor-not-allowed hover:scale-90 transition-transform">Sign In</button>
        {error && <p className="w-full text-center text-red-500">{error}</p>}
      </form>
      <p className="mt-5 text-gray-500">Doesn't have an account yet?</p>
      <p onClick={() => navigate("/signup")} className="cursor-pointer text-blue-500 hover:underline">Sign Up</p>
    </main>
  )
}
