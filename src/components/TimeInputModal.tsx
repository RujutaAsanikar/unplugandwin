
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';
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
  const [totalMinutes, setTotalMinutes] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState<number>(0);

  // Format date
  const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  // Convert total minutes to hours and minutes for display
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setTotalMinutes(value);
      setSliderValue(value);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSliderValue(value);
    setTotalMinutes(value);
  };

  const increaseMinutes = () => {
    const newValue = totalMinutes + 5;
    setTotalMinutes(newValue);
    setSliderValue(newValue);
  };

  const decreaseMinutes = () => {
    const newValue = Math.max(0, totalMinutes - 5);
    setTotalMinutes(newValue);
    setSliderValue(newValue);
  };

  const handleSubmit = () => {
    onSubmit(totalMinutes);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Screen Time</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <p className="text-sm text-muted-foreground">
            Enter how much time you spent on social media on {formattedDate}.
          </p>
          
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-muted-foreground" />
            <div className="flex-1 flex items-center">
              <Input 
                type="number" 
                value={totalMinutes} 
                onChange={handleMinutesChange}
                min={0}
                className="w-full text-center text-lg"
              />
            </div>
            <div className="flex flex-col">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={increaseMinutes}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={decreaseMinutes}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-muted-foreground text-lg">minutes</span>
          </div>
          
          <div className="w-full px-1 py-4">
            <input
              type="range"
              min="0"
              max="600"
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-full accent-primary"
            />
          </div>
          
          <motion.div 
            className="text-center bg-secondary/50 py-6 px-4 rounded-lg"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <div className="text-4xl font-medium text-foreground">
              {hours}h {minutes}m
            </div>
            <div className="text-sm text-muted-foreground mt-1">Total screen time</div>
          </motion.div>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TimeInputModal;
