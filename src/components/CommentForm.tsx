import { ImagePlus, SendHorizontal, X } from 'lucide-react';
import { useState } from 'react';

type CommentFormProps = {
  initialText?: string;
  initialImageUrl?: string;
  onSubmit: (text: string | undefined, file: File | null, removeImage: boolean) => Promise<void>;
  onClose: () => void;
};

export default function CommentForm({ initialText, initialImageUrl, onSubmit, onClose }: CommentFormProps) {

  const [textContent, setTextContent] = useState<string | undefined>(initialText);
  const [file, setFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | undefined>(initialImageUrl);


  const previewSrc = file ? URL.createObjectURL(file) : currentImage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const removeImage = !currentImage && !file && !!initialImageUrl;
    await onSubmit(textContent, file, removeImage);
    setTextContent(undefined);
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 flex flex-col rounded-md w-full">

      <div className='flex justify-between'>
        <textarea className="bg-gray-100 w-full focus:outline-none" value={textContent} onChange={(e) => setTextContent(e.target.value)}/>
        <X className='hover:scale-90 transition-transform' onClick={() => onClose()}/>
      </div>

      <div className="flex justify-between items-end mt-2">
        {previewSrc ? (
          <div className='relative'>
            <div className='absolute right-1 top-1 hover:scale-90 transition-transform p-1 bg-white rounded-sm'>
              <X className='text-black h-4 w-4' onClick={() => {setFile(null); setCurrentImage(undefined);}}/>
            </div>
            <img src={previewSrc} className="w-3xs rounded-md" />
          </div>
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
              <ImagePlus className="cursor-pointer text-gray-500 hover:scale-90 transition-transform" />
            </label>
          </>
        )}

        <button type="submit" disabled={!textContent && !file && !currentImage} className="text-blue-500 disabled:text-gray-400 hover:scale-90 transition-transform disabled:scale-100">
          <SendHorizontal />
        </button>
      </div>
    </form>
  );
}
