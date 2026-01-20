import { useAppDispatch, useAppSelector } from "../../hooks"
import { createBlog, uploadImage } from "../../features/blogs/blogSlice"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import Form from "../../components/Form";
import { X } from "lucide-react";

export default function CreateBlogPage() {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector(state => state.blogs);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const previewUrl = file ? URL.createObjectURL(file) : undefined;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      let path = null;

      if(file) {
        path = (await dispatch(uploadImage({ file, path })).unwrap()).data;
      }

      await dispatch(createBlog({ title, content, path })).unwrap();
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
        <form className="p-10 bg-white flex flex-col justify-center items-start gap-5 rounded-2xl md:drop-shadow-xl w-full md:w-2xl" onSubmit={handleCreate}>
          <h2 className="font-bold text-3xl w-full text-center mb-5">Create New Blog</h2>
          <label>Title:</label>
          <input placeholder="Title" type="text" className="bg-gray-100 border border-gray-300 rounded-md p-4 w-full" onChange={(e) => setTitle(e.target.value)} value={title}/>
          <label>Content:</label>
          <textarea placeholder="Lorem Ipsum" className="bg-gray-100 border border-gray-300 rounded-md p-4 w-full" onChange={(e) => setContent(e.target.value)} value={content}></textarea>
          {file ? (
            <div className="flex w-full gap-3 relative overflow-hidden h-50 rounded-md">
              <img src={previewUrl} alt="Blog Image" className="w-full h-full object-cover"/>
              <div className="bg-white p-1 absolute top-3 right-3 rounded-sm cursor-pointer hover:scale-90 transition-transform z-10">
                <X className="z-20 text-black" onClick={() => {setFile(null)}}/>
              </div>
            </div>
          ) : (
            <Form setFile={setFile}/>
          )}
          <button className="bg-blue-500 p-4 w-full rounded-md text-white text-center mt-5 disabled:bg-gray-500 disabled:cursor-not-allowed hover:scale-95 transition-transform disabled:scale-100" disabled={ loading || !title || (!content && !file) }>Create</button>
          {error && <p className="w-full text-center text-red-500">{error}</p>}
        </form>
      )}
    </main>
  )
}
