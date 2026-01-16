import { Pencil, Trash, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import type { Blog } from "../features/blogs/blogSlice";

export default function BlogCard({ blog }: { blog: Blog }) {

  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);

  return (
    <li className="bg-white p-4 rounded-2xl drop-shadow-xl w-full flex flex-col items-start gap-3 cursor-pointer" onClick={() => navigate(`/blogs/${blog.blog_id}`)}>
      <div className="flex justify-between w-full items-start gap-4">
        <h3 className="text-2xl font-semibold wrap-break-word overflow-wrap-anywhere min-w-0 flex-1">
          {blog.blog_title}
        </h3>
        {blog.blog_author_id === user?.id && (
          <div className="flex gap-5 shrink-0">
            <Pencil
              onClick={() => navigate(`/blogs/update/${blog.blog_id}`)}
              className="h-5 w-5 text-blue-500 hover:scale-90 transition-transform cursor-pointer"
            />
            <Trash
              onClick={() => navigate(`/blogs/delete/${blog.blog_id}`)}
              className="h-5 w-5 text-red-500 hover:scale-90 transition-transform cursor-pointer"
            />
          </div>
        )}
      </div>
      <p className="wrap-break-word overflow-wrap-anywhere w-full whitespace-pre-wrap">
        {blog.blog_content}
      </p>
      {blog.blog_signedUrl && (
        <img src={blog.blog_signedUrl} alt="blog-image" className="rounded-md"/>
      )}
      <div className="flex justify-between w-full text-gray-400 text-sm flex-wrap gap-2">
        <p className="break-all">{blog.blog_author_email}</p>
        <p className="whitespace-nowrap">
          {new Date(blog.blog_created_at).toLocaleDateString()}
        </p>
      </div>
      <div className="flex gap-3">
        <p>{blog.blog_comment_count}</p>
        <MessageCircle className=""/>
      </div>
    </li>
  );
}
