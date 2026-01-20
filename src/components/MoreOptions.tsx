import { Ellipsis } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type MoreOptionsProps = {
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function MoreOptions({ onEdit, onDelete }: MoreOptionsProps) {
  
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <Ellipsis className="text-gray-500 cursor-pointer hover:scale-90 transition-transform" onClick={(e) => {e.stopPropagation(); setOpen(!open)}}/>

      {open && (
        <div className="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-md z-10">
          {onEdit && (
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
                setOpen(false);
              }}
            >
              Edit
            </button>
          )}

          {onDelete && (
            <button
              className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
                setOpen(false);
              }}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
