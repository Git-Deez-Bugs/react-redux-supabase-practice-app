import { ImagePlus, SendHorizontal } from 'lucide-react';

export default function CommentForm({ file, setFile, textContent, setTextContent, previewUrl, handleCreateComment }: { file: File | null; setFile: (file: File) => void; textContent: string | undefined; setTextContent: (value: string) => void; previewUrl: string | undefined; handleCreateComment: (e: React.FormEvent) => Promise<void>; }) {
  return (
    <form className=" bg-gray-100 p-4 flex flex-col rounded-md focus-within:ring focus-within:ring-blue-500" onSubmit={handleCreateComment}>
      <textarea className="bg-gray-100 w-full focus:outline-none" value={textContent} onChange={(e) => setTextContent(e.target.value)}></textarea>
      <div className="flex justify-between items-end">
        {file ? (
          <img src={previewUrl} alt="comment-image" className="w-3xs rounded-md"/>
        ) : (
          <div>
            <input
              type="file"
              accept="image/*"
              id="file-input"
              className="hidden"
              onChange={(e) => {
                if (!e.target.files) return;
                setFile(e.target.files[0]);
              }}
            />

            
            <label htmlFor="file-input">
              <ImagePlus
                className="cursor-pointer text-gray-500 hover:scale-90 transition-transform"
                size={24}
              />
            </label>
          </div>
        )}
        <button className="text-blue-500 hover:scale-90 transition-transform disabled:text-gray-500 disabled:scale-100" disabled={!textContent && !file} >  
          <SendHorizontal />
        </button>
      </div>
    </form>
  )
}
