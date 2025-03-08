
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 24) {
      setHours(value);
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 59) {
      setMinutes(value);
    }
  };

  const handleSubmit = () => {
    const totalMinutes = (hours * 60) + minutes;
    onSubmit(totalMinutes);
  };

  // Format date
  const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Screen Time</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <p className="text-sm text-muted-foreground">
            How much time did you spend on social media on {formattedDate}?
          </p>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
              <Input 
                id="hours"
                type="number" 
                value={hours} 
                onChange={handleHoursChange}
                min={0}
                max={24}
                className="w-full"
                placeholder="Hours"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="minutes" className="block text-sm font-medium text-gray-700 mb-1">Minutes</label>
              <Input 
                id="minutes"
                type="number" 
                value={minutes} 
                onChange={handleMinutesChange}
                min={0}
                max={59}
                className="w-full"
                placeholder="Minutes"
              />
            </div>
          </div>
          
          <motion.div 
            className="text-center bg-secondary/50 py-3 px-4 rounded-lg"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <div className="text-3xl font-medium text-foreground">
              {hours}h {minutes}m
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total screen time</div>
          </motion.div>
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
            className="bg-primary hover:bg-primary/90"
          >
            Log Time
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TimeInputModal;
