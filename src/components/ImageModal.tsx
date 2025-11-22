import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, alt, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fade-in"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-slate-800 text-slate-200 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors border border-slate-700"
      >
        <X size={24} />
      </button>
      
      <img 
        src={src} 
        alt={alt} 
        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-slate-800 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
      />
    </div>
  );
};

export default ImageModal;