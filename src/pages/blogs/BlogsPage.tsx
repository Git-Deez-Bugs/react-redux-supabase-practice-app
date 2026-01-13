import { useAppDispatch, useAppSelector } from "../../hooks";
import { readBlogs } from "../../features/blogs/blogSlice";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";

export default function BlogsPage() {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { blogs, loading, error } = useAppSelector(state => state.blogs);
  const { user } = useAppSelector(state => state.auth);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;



  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const result = await dispatch(readBlogs({ page, pageSize })).unwrap();
        const count = result.count ?? 0;
        setTotalPages(Math.ceil((count ?? 0) / pageSize));
      } catch {
        //
      }
    }

    fetchBlogs();
  }, [dispatch, page])

  const handlePrev = () => setPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setPage(prev => Math.min(prev + 1, totalPages));

  return (
    <main className={`h-screen w-full flex ${loading ? "items-center" : "items-start"} justify-center  bg-gray-100 p-30`}>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="text-center flex flex-col justify-between h-full items-center gap-5">
          <h2 className="text-3xl font-bold">Blogs</h2>

          <ul className="flex flex-col justifiy-start items-center gap-5 h-200 bg-amber-50 p-10 w-4xl">
            {blogs.map(blog => (
              <li key={blog.blog_id} className="bg-white p-4 rounded-2xl drop-shadow-xl w-full flex flex-col items-start">
                <div className="flex justify-between w-full">
                  <h3 className="text-2xl font-semibold truncate">{blog.blog_title}</h3>
                  {blog.blog_author_id === user?.id &&
                    <div className="flex gap-5">
                      <Pencil onClick={() => navigate(`/blogs/update/${blog.blog_id}`)} className="text-2xl text-blue-500 hover:scale-90 transition-transform"/>
                      <Trash onClick={() => navigate(`/blogs/delete/${blog.blog_id}`)} className="text-2xl text-red-500 hover:scale-90 transition-transform"/>
                    </div>
                  }
                </div>
                <p className="truncate">{blog.blog_content}</p>
                <div className="flex justify-between w-full text-gray-400"><p>{blog.blog_author_email}</p><p>{blog.blog_created_at}</p></div>
                
              </li>
            ))}
          </ul>

          <div className="bg-white rounded-md drop-shadow-md">
            <button onClick={handlePrev} disabled={page === 1} className="p-3 disabled:text-gray-300 disabled:cursor-not-allowed hover:text-blue-500">Prev</button>
            <span className="border-x border-gray-300 p-3">Page {page} of {totalPages}</span>
            <button onClick={handleNext} disabled={page === totalPages} className="p-3 disabled:text-gray-300 disabled:cursor-not-allowed hover:text-blue-500">Next</button>
          </div>
        </div>
      )}
    </main>
  )
}
