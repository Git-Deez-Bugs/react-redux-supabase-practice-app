import { useAppDispatch, useAppSelector } from "../../hooks";
import { deleteBlog, readBlog } from "../../features/blogs/blogSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function DeleteBlogPage() {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { blog, loading, error } = useAppSelector(state => state.blogs);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        await dispatch(readBlog({ id }));
      } catch {
        //
      }
    }

    fetchBlog();
  }, [id, dispatch]);

  const handleDelete = async () => {
    if (!id) return;

    try {
      await dispatch(deleteBlog({ id, path: blog?.blog_image_path || null }));
      navigate("/");
    } catch {
      //
    }
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center  bg-gray-100 p-30 overflow-y-auto">
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex flex-col justify-center items-center pt-10 p-4 drop-shadow-2xl bg-white rounded-2xl gap-5 w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-red-500 mb-3">Are you sure you want to permanently delete this blog?</h2>
          <h2 className="text-2xl font-bold wrap-break-word overflow-wrap-anywhere w-full whitespace-pre-wrap">{blog?.blog_title}</h2>
          <p className="wrap-break-word overflow-wrap-anywhere w-full whitespace-pre-wrap">{blog?.blog_content}</p>
          {blog?.blog_signedUrl && (
            <img src={blog.blog_signedUrl} alt="blog-image" className="rounded-md w-full"/>
          )}
          <div className="text-gray-500 flex justify-between items-center w-full">
            <p>{blog?.blog_author_email}</p>
            <p>{new Date(blog?.blog_created_at ?? "").toLocaleDateString()}</p>
          </div>
          <div className="flex justify-center items-center w-full gap-5">
            <button className="p-4 bg-red-500 text-white rounded-md hover:scale-95 transition-transform" onClick={handleDelete}>Delete</button>
            <button className="p-4 bg-gray-500 text-white rounded-md hover:scale-95 transition-transform" onClick={() => navigate("/")}>Cancel</button>
          </div>
        </div>
      )}
    </main>
  )
}
