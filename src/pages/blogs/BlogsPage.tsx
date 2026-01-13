import { useAppDispatch, useAppSelector } from "../../hooks";
import { readBlogs } from "../../features/blogs/blogSlice";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useEffect, useState } from "react";
import BlogCard from "../../components/BlogCard";

export default function BlogsPage() {

  const dispatch = useAppDispatch();
  const { blogs, loading, error } = useAppSelector(state => state.blogs);

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
        <div className="flex flex-col justify-between h-full items-center gap-5">
          <h2 className="text-3xl font-bold">Blogs</h2>

          <ul className="flex flex-col justify-start items-center gap-5 h-210 p-10 w-4xl overflow-y-scroll">
            {blogs.map(blog => (
              <BlogCard key={blog.blog_id} blog={blog} />
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
