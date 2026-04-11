import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#111118] rounded-xl border border-white/10 w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b border-white/5">
          <h3 className="text-white font-semibold">{title}</h3>
          <button onClick={onClose}>
            <X className="text-gray-400" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}