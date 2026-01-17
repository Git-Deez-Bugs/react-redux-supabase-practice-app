import { useAppDispatch, useAppSelector } from "../../hooks";
import { createComment, readBlogWithComments, updateComment, uploadImage, type Comment } from "../../features/blogs/blogSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { MessageCircle } from "lucide-react";
import CommentCard from "../../components/CommentCard";
import CommentForm from "../../components/CommentForm";
import MoreOptions from "../../components/MoreOptions";

export default function BlogPage() {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { blog, loading, error } = useAppSelector(state => state.blogs);
  const { user } = useAppSelector(state => state.auth);
  const { id } = useParams<{ id: string }>();

  const [willComment, setWillComment] = useState<string | null>(null);
  const [commentToEdit, setCommentToEdit] = useState<Comment | null>(null);

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

  const handleCreateComment = async (text: string | undefined, file: File | null) => {
    if(!id) return;

    try {
      let path = null;

      if(file) {
        path = (await dispatch(uploadImage({ file, path })).unwrap()).data;
      }

      await dispatch(createComment({ id, textContent: text, path })).unwrap();

      await dispatch(readBlogWithComments({ id })).unwrap();
      setWillComment(null);
    } catch {
      //
    }
  }

  const handleUpdateComment = async (text: string | undefined, file: File | null, removeImage: boolean) => {
    if (!id || !commentToEdit) return;

    try {
      let path = null;

      if(file) {
        path = (await dispatch(uploadImage({ file, path })).unwrap()).data;
      }

      await dispatch(updateComment({ blogId: id, comment: commentToEdit, textContent: text, path, removeImage })).unwrap();

      await dispatch(readBlogWithComments({ id })).unwrap();
      setCommentToEdit(null)
    } catch {
      //
    }
  };


  return (
    <main className="min-h-screen w-full flex items-center justify-center  bg-gray-100 pt-20 md:p-30 overflow-y-auto">
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex flex-col justify-center items-center py-4 drop-shadow-2xl bg-white md:rounded-2xl gap-5 w-full max-w-4xl">

          {/* Blog Top */}
          <div className="text-gray-500 flex justify-between items-center w-full px-4">
            <p>{blog?.blog_author_email}</p>
            <div className="flex gap-3">
              <p>{new Date(blog?.blog_created_at ?? "").toLocaleDateString()}</p>
              { blog?.blog_author_id === user?.id && (
                <MoreOptions onDelete={() => navigate(`/blogs/delete/${id}`)} onEdit={() => navigate(`/blogs/update/${id}`)} />
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
            <MessageCircle className="cursor-pointer hover:scale-95 transition-transform" onClick={() => setWillComment(prev => prev ? null : "comment")}/>
          </div>

          {/* Comment Section */}
          {((blog?.blog_comments ?? []).length > 0 || willComment) && (
            <div className="px-4 w-full">
              <div className="w-full pt-4 text-start flex flex-col gap-3 border-t border-gray-300">
                {willComment && (
                  <CommentForm onSubmit={handleCreateComment} onClose={setWillComment}/>
                )}
                {(blog?.blog_comments ?? []).map(comment => (
                  <div key={comment.comment_id}>
                    {commentToEdit?.comment_id === comment.comment_id ? (
                      <CommentForm initialText={comment.comment_text_content ?? undefined} initialImageUrl={comment.comment_signed_url} onSubmit={handleUpdateComment} onClose={() => setCommentToEdit(null)}/>
                    ) : (
                      <CommentCard comment={comment} setCommentToEdit={setCommentToEdit} id={id} userId={user?.id}/>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
