import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Upload, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, getPublicUrl } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';

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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

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
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, GIF)",
        variant: "destructive"
      });
      return;
    }
    
    setFile(file);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadToSupabase = async () => {
    if (!file || !user) return null;
    
    try {
      setUploading(true);
      
      // Format: {user_id}/{timestamp}_{filename}
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // Compress and resize the image before uploading if it's too large
      const compressedFile = await compressImage(file);
      
      // Upload to the public screenshots bucket
      const { data, error } = await supabase.storage
        .from('screenshots')
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: true // Use upsert to replace if file exists
        });
        
      if (error) throw error;
      
      // Get the public URL with correct CORS settings and cache busting
      const publicUrl = getPublicUrl('screenshots', filePath);
      
      console.log('Uploaded image URL:', publicUrl);
      
      // Preload the image to ensure it loads properly
      const preloaded = await preloadImage(publicUrl);
      if (!preloaded) {
        console.warn("Image preloading failed, but continuing with upload");
      }
      
      return filePath;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const preloadImage = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.onload = () => resolve(true);
      img.onerror = () => {
        console.error("Failed to preload image:", url);
        resolve(false);
      };
      img.src = url;
      img.crossOrigin = "anonymous";
    });
  };

  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.onload = () => {
          // Create a canvas element
          const canvas = document.createElement('canvas');
          
          // Define max dimensions
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round(height * (MAX_WIDTH / width));
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round(width * (MAX_HEIGHT / height));
              height = MAX_HEIGHT;
            }
          }
          
          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;
          
          // Draw resized image to canvas
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert canvas to blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                // If compression fails, use original file
                resolve(file);
              }
            },
            file.type,
            0.8 // Quality parameter (0.8 = 80% quality)
          );
        };
      };
    });
  };

  const handleContinue = async () => {
    if (!preview) return;
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload screenshots",
        variant: "destructive"
      });
      return;
    }
    
    const imageFilePath = await uploadToSupabase();
    
    if (imageFilePath) {
      onUpload(imageFilePath);
      
      toast({
        title: "Upload successful",
        description: "Your screenshot has been uploaded successfully",
      });
      
      // After successful upload, reset the state
      setPreview(null);
      setFile(null);
    }
  };

  const handleRemovePreview = () => {
    setPreview(null);
    setFile(null);
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
                  <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
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
                <div className="rounded-lg overflow-hidden aspect-video bg-gray-50">
                  <img src={preview} alt="Preview" className="w-full h-full object-contain" />
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
            disabled={!preview || uploading}
            onClick={handleContinue}
            className="button-hover bg-primary hover:bg-primary/90"
          >
            {uploading ? (
              <>
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Uploading...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
