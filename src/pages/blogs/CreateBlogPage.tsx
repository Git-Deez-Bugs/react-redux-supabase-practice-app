import { useAppDispatch, useAppSelector } from "../../hooks"
import { createBlog } from "../../features/blogs/blogSlice"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function CreateBlogPage() {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector(state => state.blogs);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(createBlog({ title, content })).unwrap();
      navigate("/")
    } catch {
      //
    }
  }

  return (
    <main className="h-screen w-full flex items-center justify-center  bg-gray-100 p-30">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <form className="p-10 bg-white flex flex-col justify-center items-start gap-5 rounded-2xl drop-shadow-xl" onSubmit={handleCreate}>
          <h2 className="font-bold text-3xl w-full text-center mb-5">Create New Blog</h2>
          <label>Title:</label>
          <input placeholder="Title" type="text" className="bg-gray-100 border border-gray-300 rounded-md p-4 w-90" onChange={(e) => setTitle(e.target.value)} value={title}/>
          <label>Content:</label>
          <textarea placeholder="Lorem Ipsum" className="bg-gray-100 border border-gray-300 rounded-md p-4 w-90" onChange={(e) => setContent(e.target.value)} value={content}></textarea>
          <button className="bg-blue-500 p-4 w-full rounded-md text-white text-center mt-5 disabled:bg-gray-500 disabled:cursor-not-allowed hover:scale-95 transition-transform" disabled={ loading || !title || !content }>Create</button>
          {error && <p className="w-full text-center text-red-500">{error}</p>}
        </form>
      )}
    </main>
  )
}
