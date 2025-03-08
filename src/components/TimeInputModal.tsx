
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimeInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (minutes: number) => void;
  selectedDate: string;
}

const TimeInputModal: React.FC<TimeInputModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  selectedDate
}) => {
  const [minutes, setMinutes] = useState<number>(60);

  const handleMinutesChange = (value: number[]) => {
    setMinutes(value[0]);
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 720) {
      setMinutes(value);
    }
  };

  const handleSubmit = () => {
    onSubmit(minutes);
  };

  // Format time in hours and minutes
  const formatTime = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
  };

  // Format date
  const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md glassmorphism">
        <DialogHeader>
          <DialogTitle>Enter Screen Time</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <p className="text-sm text-muted-foreground">
            Enter how much time you spent on social media on {formattedDate}.
          </p>
          
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <Input 
                type="number" 
                value={minutes} 
                onChange={handleManualInput}
                className="flex-1"
                min={0}
                max={720}
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">minutes</span>
            </div>
            
            <Slider
              value={[minutes]}
              min={0}
              max={720}
              step={5}
              onValueChange={handleMinutesChange}
              className="py-4"
            />
            
            <motion.div 
              className="text-center bg-secondary/50 py-3 px-4 rounded-lg"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <div className="text-3xl font-medium text-foreground">{formatTime(minutes)}</div>
              <div className="text-xs text-muted-foreground mt-1">Total screen time</div>
            </motion.div>
          </div>
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
            onClick={handleSubmit}
            className="button-hover bg-primary hover:bg-primary/90"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TimeInputModal;
