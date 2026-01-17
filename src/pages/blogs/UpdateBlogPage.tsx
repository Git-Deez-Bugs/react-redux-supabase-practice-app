import { useAppDispatch, useAppSelector } from "../../hooks"
import { updateBlog, readBlog, uploadImage, deleteImage } from "../../features/blogs/blogSlice"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import Form from "../../components/Form";
import { X } from "lucide-react";

export default function UpdateBlogPage() {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector(state => state.blogs);
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [oldFilePath, setOldFilePath] = useState<string | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | undefined>(undefined);
  const previewUrl = file ? URL.createObjectURL(file) : signedUrl;
  const hasFile = !!file || !!filePath;

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const blog = await dispatch(readBlog({ id })).unwrap();

        if (blog) {
          setTitle(blog.blog_title);
          setContent(blog.blog_content);
          setFilePath(blog.blog_image_path);
          setOldFilePath(blog.blog_image_path);
          setSignedUrl(blog.blog_signedUrl);
        }

      } catch {
        //
      }
    }

    fetchBlog();
  }, [id, dispatch]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    try {
      let path = null;

      if (file) {

        if (oldFilePath) {
          await dispatch(deleteImage({ path: oldFilePath })).unwrap();
        }

        path = (await dispatch(uploadImage({ file, path })).unwrap()).data;
      }

      await dispatch(updateBlog({ id, title, content, path })).unwrap();
      navigate("/")
    } catch {
      //
    }
  }

  return (
    <main className="h-screen w-full flex items-center justify-center  md:bg-gray-100 md:p-30">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <form className="p-10 bg-white flex flex-col justify-center items-start gap-5 rounded-2xl md:drop-shadow-xl w-full md:w-2xl" onSubmit={handleUpdate}>
          <h2 className="font-bold text-3xl w-full text-center mb-5">Update Blog</h2>
          <label>Title:</label>
          <input placeholder="Title" type="text" className="bg-gray-100 border border-gray-300 rounded-md p-4 w-full" onChange={(e) => setTitle(e.target.value)} value={title}/>
          <label>Content:</label>
          <textarea placeholder="Lorem Ipsum" className="bg-gray-100 border border-gray-300 rounded-md p-4 w-full" onChange={(e) => setContent(e.target.value)} value={content}></textarea>
          {hasFile ? (
            <div className="flex w-full gap-3 relative overflow-hidden h-50 rounded-md">
              <img src={previewUrl} alt="Blog Image" className="w-full h-full object-cover"/>
              <X className="absolute top-5 right-5 cursor-pointer hover:scale-90 transition-transform z-10 text-white" onClick={() => {setFile(null); setFilePath(null); setSignedUrl(undefined)}}/>
            </div>
          ) : (
            <Form setFile={setFile}/>
          )}
          <button className="bg-blue-500 p-4 w-full rounded-md text-white text-center mt-5 disabled:bg-gray-500 disabled:cursor-not-allowed hover:scale-95 transition-transform" disabled={ loading || !title || !content }>Update</button>
          {error && <p className="w-full text-center text-red-500">{error}</p>}
        </form>
      )}
    </main>
  )
}
