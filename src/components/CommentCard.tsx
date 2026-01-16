import type { Comment } from "../features/blogs/blogSlice";

export default function CommentCard({ comment }: { comment: Comment }) {
  return (
    <div key={comment.comment_id} className="bg-gray-100 w-full p-4 rounded-md flex flex-col">
      <img src="" alt="" />
      <p className="font-semibold">{comment.comment_author_email}</p>
      <p className="p-4 text-justify wrap-break-word overflow-wrap-anywhere whitespace-pre-wrap">{comment.comment_text_content}</p>
    </div>
  )
}
