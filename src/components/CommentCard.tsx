import { deleteComment, readBlogWithComments, type Comment } from "../features/blogs/blogSlice";
import { useAppDispatch } from "../hooks";
import MoreOptions from "./MoreOptions";

type CommentCardProps = {
  comment: Comment;
  setCommentToEdit: (comment: Comment) => void;
  id: string | undefined;
  userId: string | undefined;
}

export default function CommentCard({ comment, setCommentToEdit, id, userId }: CommentCardProps) {

  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    if (!id || !comment.comment_id) return;
    
    try {
      await dispatch(deleteComment({ id: comment.comment_id, path: comment.comment_image_path || null }));
      await dispatch(readBlogWithComments({ id })).unwrap();
    } catch {
      //
    }
  }

  return (
    <div key={comment.comment_id} className="bg-gray-100 w-full p-4 rounded-md flex flex-col">
      <div className="flex justify-between">
        <p className="font-semibold">{comment.comment_author_email}</p>
        {comment.comment_author_id === userId &&
          <MoreOptions
            onEdit={() => setCommentToEdit(comment)}
            onDelete={handleDelete}
          />
        }
      </div>
      {comment.comment_image_path && <img src={comment.comment_signed_url} alt="comment-image" className="rounded-md m-4 mb-0"/>}
      <p className="p-4 text-justify wrap-break-word overflow-wrap-anywhere whitespace-pre-wrap">{comment.comment_text_content}</p>
    </div>
  )
}
