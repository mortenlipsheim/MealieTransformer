
"use client";

import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Cropper, CropperRef } from "react-advanced-cropper";
import { useTranslation } from "@/hooks/use-translation";

interface CropperDialogProps {
  image: string | null;
  onConfirm: (dataUrl: string) => void;
  onCancel: () => void;
}

export default function CropperDialog({
  image,
  onConfirm,
  onCancel,
}: CropperDialogProps) {
  const cropperRef = useRef<CropperRef>(null);
  const { t } = useTranslation();

  const handleCrop = () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCanvas();
      if (canvas) {
        onConfirm(canvas.toDataURL());
      }
    }
  };

  return (
    <Dialog open={!!image} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('Crop Image')}</DialogTitle>
        </DialogHeader>
        <div className="flex-grow relative min-h-0">
          <div className="absolute inset-0">
            {image && (
                <Cropper
                ref={cropperRef}
                src={image}
                />
            )}
          </div>
        </div>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onCancel}>
            {t('Cancel')}
          </Button>
          <Button onClick={handleCrop}>{t('Confirm Crop')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
