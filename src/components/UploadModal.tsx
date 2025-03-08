
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Upload, Image, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (imageUrl: string) => void;
  onSelectDate: (date: string) => void;
  selectedDate: string;
}

const UploadModal: React.FC<UploadModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpload, 
  onSelectDate,
  selectedDate
}) => {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Check file is an image
    if (!file.type.startsWith('image/')) {
      console.error('File must be an image');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleContinue = () => {
    if (preview) {
      onUpload(preview);
    }
  };

  const handleRemovePreview = () => {
    setPreview(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md glassmorphism">
        <DialogHeader>
          <DialogTitle>Add Screen Time Entry</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex gap-4 items-center">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <Input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => onSelectDate(e.target.value)}
              className="flex-1"
            />
          </div>

          <AnimatePresence mode="wait">
            {!preview ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-48 text-center
                    ${dragging ? 'border-primary bg-primary/5' : 'border-border'}`}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setDragging(false);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop your screenshot or click to browse</p>
                  <p className="text-xs text-muted-foreground">Supports PNG, JPG, GIF</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <div className="rounded-lg overflow-hidden aspect-video bg-gray-100">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
                  onClick={handleRemovePreview}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!preview}
            onClick={handleContinue}
            className="button-hover bg-primary hover:bg-primary/90"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
