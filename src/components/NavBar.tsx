import { useNavigate } from "react-router-dom"


export default function NavBar() {
  const navigate = useNavigate();

  return (
    <nav className="p-4 flex justify-between items-center bg-white drop-shadow-md fixed top-0 left-0 w-full z-50">
      <h1 onClick={() => navigate("/")} className="text-2xl font-bold cursor-pointer">Blog</h1>
      <div className="flex justify-center items-center gap-5">
        <p onClick={() => navigate("/blogs/create")} className="text-blue-500 cursor-pointer hover:underline transition-all">Create</p>
        <button onClick={() => navigate("/signout")} className="bg-blue-500 px-4 py-3 rounded-md text-white cursor-pointer hover:scale-90 transition-transform">Sign Out</button>
      </div>
    </nav>
  )
}
