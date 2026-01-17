import { ImagePlus, SendHorizontal, X } from 'lucide-react';
import { useState } from 'react';

type CommentFormProps = {
  initialText?: string;
  initialImageUrl?: string;
  onSubmit: (text: string | undefined, file: File | null) => Promise<void>;
  onClose: (close: string | null) => void;
};

export default function CommentForm({ initialText, initialImageUrl, onSubmit, onClose }: CommentFormProps) {

  const [textContent, setTextContent] = useState<string | undefined>(initialText);
  const [file, setFile] = useState<File | null>(null);

  const previewSrc = file ? URL.createObjectURL(file) : initialImageUrl;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(textContent, file);
    setTextContent(undefined);
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 flex flex-col rounded-md w-full">

      <div className='flex justify-between'>
        <textarea className="bg-gray-100 w-full focus:outline-none" value={textContent} onChange={(e) => setTextContent(e.target.value)}/>
        <X className='hover:scale-90 transition-transform' onClick={() => onClose(null)}/>
      </div>

      <div className="flex justify-between items-end mt-2">
        {previewSrc ? (
          <img src={previewSrc} className="w-3xs rounded-md" />
        ) : (
          <>
            <input
              type="file"
              accept="image/*"
              id="file-input"
              hidden
              onChange={(e) => {
                if (!e.target.files) return;
                setFile(e.target.files[0]);
              }}
            />
            <label htmlFor="file-input">
              <ImagePlus className="cursor-pointer text-gray-500" />
            </label>
          </>
        )}

        <button type="submit" disabled={!textContent && !file} className="text-blue-500 disabled:text-gray-400 hover:scale-90 transition-transform">
          <SendHorizontal />
        </button>
      </div>
    </form>
  );
}
