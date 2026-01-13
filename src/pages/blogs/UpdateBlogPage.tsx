import { useAppDispatch, useAppSelector } from "../../hooks"
import { updateBlog, readBlog } from "../../features/blogs/blogSlice"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function UpdateBlogPage() {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector(state => state.blogs);
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const blog = await dispatch(readBlog({ id })).unwrap();

        if(blog) {
          setTitle(blog.blog_title);
          setContent(blog.blog_content);
        }
      } catch {
        //
      }
    }

    fetchBlog();
  }, [id, dispatch])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    try {
      await dispatch(updateBlog({ id, title, content })).unwrap();
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
        <form className="p-10 bg-white flex flex-col justify-center items-start gap-5 rounded-2xl drop-shadow-xl" onSubmit={handleUpdate}>
          <h2 className="font-bold text-3xl w-full text-center mb-5">Update Blog</h2>
          <label>Title:</label>
          <input placeholder="Title" type="text" className="bg-gray-100 border border-gray-300 rounded-md p-4 w-90" onChange={(e) => setTitle(e.target.value)} value={title}/>
          <label>Content:</label>
          <textarea placeholder="Lorem Ipsum" className="bg-gray-100 border border-gray-300 rounded-md p-4 w-90" onChange={(e) => setContent(e.target.value)} value={content}></textarea>
          <button className="bg-blue-500 p-4 w-full rounded-md text-white text-center mt-5 disabled:bg-gray-500 disabled:cursor-not-allowed hover:scale-95 transition-transform" disabled={ loading || !title || !content }>Update</button>
          {error && <p className="w-full text-center text-red-500">{error}</p>}
        </form>
      )}
    </main>
  )
}
