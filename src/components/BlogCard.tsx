import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import type { Blog } from "../features/blogs/blogSlice";
import MoreOptions from "./MoreOptions";

export default function BlogCard({ blog }: { blog: Blog }) {

  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);

  return (
    <li className="bg-white py-4 md:rounded-2xl drop-shadow-xl w-full flex flex-col items-start gap-3 cursor-pointer" onClick={() => navigate(`/blogs/${blog.blog_id}`)}>
      <div className="flex justify-between w-full text-gray-500 text-sm flex-wrap gap-2 px-4">
        <p className="break-all">{blog.blog_author_email}</p>
        <div className="flex gap-3">
          <p className="whitespace-nowrap">
            {new Date(blog.blog_created_at).toLocaleDateString()}
          </p>
          {blog.blog_author_id === user?.id && (
            <MoreOptions onDelete={() => navigate(`/blogs/delete/${blog.blog_id}`)} onEdit={() => navigate(`/blogs/update/${blog.blog_id}`)} />
          )}
        </div>
      </div>
      <div className="flex justify-between w-full items-start gap-4 px-4">
        <h3 className="text-2xl font-semibold wrap-break-word overflow-wrap-anywhere min-w-0 flex-1 text-justify">
          {blog.blog_title}
        </h3>
      </div>
      <p className="wrap-break-word overflow-wrap-anywhere w-full whitespace-pre-wrap px-4 text-justify">
        {blog.blog_content}
      </p>
      {blog.blog_signedUrl && (
        <img src={blog.blog_signedUrl} alt="blog-image" className="w-full"/>
      )}
      <div className="flex gap-3 px-4">
        <p>{blog.blog_comment_count}</p>
        <MessageCircle className=""/>
      </div>
    </li>
  );
}
