import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../hooks";
import LoadingSpinner from "../../components/LoadingSpinner";
import { signOutUser } from "../../features/auth/authSlice";

export default function SignOutPage() {

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await dispatch(signOutUser());
    navigate("/signin");
  }

  return (
    <main className="h-screen w-full flex items-center justify-center  bg-gray-100 p-30">
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="flex flex-col justify-center items-center p-10 drop-shadow-2xl bg-white rounded-2xl gap-10">
          <h2 className="text-2xl font-bold">Are you sure you want to sign out?</h2>
          <div className="flex justify-center items-center w-full gap-5">
            <button className="p-4 bg-red-500 text-white rounded-md hover:scale-95 transition-transform" onClick={handleSignOut}>Sign Out</button>
            <button className="p-4 bg-gray-500 text-white rounded-md hover:scale-95 transition-transform" onClick={() => navigate("/")}>Cancel</button>
          </div>
        </div>
      )}
    </main>
  )
}
