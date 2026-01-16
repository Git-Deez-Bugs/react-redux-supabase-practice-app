import { useAppDispatch, useAppSelector } from "../../hooks";
import { createComment, readBlogWithComments, uploadImage } from "../../features/blogs/blogSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { EllipsisVertical, MessageCircle } from "lucide-react";
import CommentCard from "../../components/CommentCard";
import CommentForm from "../../components/CommentForm";

export default function BlogPage() {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { blog, loading, error } = useAppSelector(state => state.blogs);
  const { user } = useAppSelector(state => state.auth);
  const { id } = useParams<{ id: string }>();

  const [willComment, setWillComment] = useState(false);
  const [textContent, setTextContent] = useState<string | undefined>("");
  const [file, setFile] = useState<File | null>(null);
  const previewUrl = file ? URL.createObjectURL(file) : undefined;

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        await dispatch(readBlogWithComments({ id })).unwrap();
      } catch {
        //
      }
    }

    fetchBlog();
  }, [id, dispatch]);

  const handleCreateComment = async (e: React.FormEvent) => {
    if(!id) return;
    e.preventDefault();

    try {
      let path = null;

      if(file) {
        path = (await dispatch(uploadImage({ file, path })).unwrap()).data;
      }

      await dispatch(createComment({ id, textContent, path })).unwrap();

      setFile(null);
      setTextContent(undefined);

      await dispatch(readBlogWithComments({ id })).unwrap();
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
        <div className="flex flex-col justify-center items-center py-4 drop-shadow-2xl bg-white rounded-2xl gap-5 w-full max-w-4xl">

          {/* Blog Top */}
          <div className="text-gray-500 flex justify-between items-center w-full px-4">
            <p>{blog?.blog_author_email}</p>
            <div className="flex gap-3">
              <p>{new Date(blog?.blog_created_at ?? "").toLocaleDateString()}</p>
              { blog?.blog_author_id === user?.id && (
                <EllipsisVertical />
              )}
            </div>
          </div>

          {/* Blog Content */}
          <h2 className="text-justify text-2xl font-bold wrap-break-word overflow-wrap-anywhere w-full whitespace-pre-wrap px-4">{blog?.blog_title}</h2>
          <p className="text-justify wrap-break-word overflow-wrap-anywhere w-full whitespace-pre-wrap px-4">{blog?.blog_content}</p>
          {blog?.blog_signedUrl && (
            <img src={blog.blog_signedUrl} alt="blog-image" className="w-full"/>
          )}

          {/* Comment Icon */}
          <div className="w-full px-4">
            <MessageCircle className="cursor-pointer hover:scale-95 transition-transform" onClick={() => setWillComment(true)}/>
          </div>

          {/* Comment Section */}
          <div className="px-4">
            <div className="w-full pt-4 text-start flex flex-col gap-3 border-t border-gray-300">
              {blog?.blog_comments?.length ? (
                blog.blog_comments.map(comment => (
                  <CommentCard comment={comment} />
                ))
              ) : null}
              {willComment && (
                <CommentForm file={file} setFile={setFile} textContent={textContent} setTextContent={setTextContent} previewUrl={previewUrl} handleCreateComment={handleCreateComment} />
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
