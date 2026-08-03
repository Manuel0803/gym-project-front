'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background border border-border-primary rounded-lg shadow-2xl w-full max-w-md relative flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-border-primary">
          <h3 className="text-lg font-bold text-text-main">{title}</h3>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-white transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
