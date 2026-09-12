'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Cropper from 'react-easy-crop';
import { Camera, User, Trash2 } from 'lucide-react';
import { Modal } from '@/common/components/ui/Modal';
import { getCroppedImg } from '../../utils/cropImage';

interface ImageUploadProps {
  currentImageUrl?: string | null;
  onImageSelect: (file: File | null) => void;
  disabled?: boolean;
}

export function ImageUpload({ currentImageUrl, onImageSelect, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);

  useEffect(() => {
    setPreview(currentImageUrl || null);
  }, [currentImageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setIsCropping(true);
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      if (croppedFile) {
        const objectUrl = URL.createObjectURL(croppedFile);
        setPreview(objectUrl);
        onImageSelect(croppedFile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCropping(false);
      setIsCropModalOpen(false);
      setImageSrc(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCloseModal = () => {
    setIsCropModalOpen(false);
    setImageSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full border-2 border-border-primary bg-background flex items-center justify-center overflow-hidden relative shadow-inner">
          {preview ? (
            <Image 
              src={preview} 
              alt="Vista previa" 
              fill
              sizes="128px"
              className="object-cover"
              unoptimized={preview.startsWith('blob:')}
            />
          ) : (
            <User size={48} className="text-text-muted" />
          )}
          
          {!disabled && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-surface/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]"
            >
              <Camera className="text-text-main" size={24} />
            </div>
          )}
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg, image/png, image/webp"
        onChange={handleFileChange}
        disabled={disabled}
      />

      {!disabled && preview && (
        <button
          type="button"
          onClick={handleRemove}
          className="flex items-center gap-2 text-xs font-medium text-danger-main hover:text-danger-hover transition-colors hover:bg-surface-hover px-3 py-1 rounded-sm cursor-pointer "
        >
          <Trash2 size={14} />
          Quitar foto
        </button>
      )}

      <Modal isOpen={isCropModalOpen} onClose={handleCloseModal} title="Ajustar Foto de Perfil">
        <div className="flex flex-col gap-6">
          <div className="relative w-full h-64 bg-background border border-border-primary rounded-md overflow-hidden">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-text-muted uppercase">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-brand-main"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleCloseModal}
              disabled={isCropping}
              className="px-6 py-2.5 border border-border-primary bg-transparent text-text-muted hover:text-text-main hover:bg-surface-hover rounded-sm text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleCropConfirm}
              disabled={isCropping}
              className="px-6 py-2.5 bg-brand-main hover:bg-brand-hover text-white rounded-sm text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isCropping ? 'Recortando...' : 'Aplicar Foto'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
