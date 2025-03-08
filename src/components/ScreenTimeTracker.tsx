
import React, { useState, useRef } from 'react';
import { ScreenTimeEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Upload, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScreenTimeGraph from './ScreenTimeGraph';
import UploadModal from './UploadModal';
import TimeInputModal from './TimeInputModal';
import { useToast } from '@/components/ui/use-toast';

const ScreenTimeTracker = () => {
  const [screenTimeEntries, setScreenTimeEntries] = useState<ScreenTimeEntry[]>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [timeInputModalOpen, setTimeInputModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAddEntry = (minutes: number) => {
    // Check if an entry for this date already exists
    const existingEntryIndex = screenTimeEntries.findIndex(
      entry => entry.date === selectedDate
    );

    if (existingEntryIndex !== -1) {
      // Update existing entry
      const updatedEntries = [...screenTimeEntries];
      updatedEntries[existingEntryIndex] = {
        ...updatedEntries[existingEntryIndex],
        minutes,
        screenshotUrl: selectedImage || updatedEntries[existingEntryIndex].screenshotUrl
      };
      setScreenTimeEntries(updatedEntries);
    } else {
      // Add new entry
      const newEntry: ScreenTimeEntry = {
        id: crypto.randomUUID(),
        date: selectedDate,
        minutes,
        screenshotUrl: selectedImage
      };
      setScreenTimeEntries([...screenTimeEntries, newEntry]);
    }

    // Reset states
    setSelectedImage(null);
    setTimeInputModalOpen(false);

    toast({
      title: "Screen time saved",
      description: `You've recorded ${minutes} minutes for ${new Date(selectedDate).toLocaleDateString()}`,
    });
  };

  const handleImageUpload = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setUploadModalOpen(false);
    setTimeInputModalOpen(true);
  };

  const handleDeleteEntry = (id: string) => {
    setScreenTimeEntries(screenTimeEntries.filter(entry => entry.id !== id));
    toast({
      title: "Entry deleted",
      description: "The screen time entry has been removed",
    });
  };

  // Sort entries by date (newest first)
  const sortedEntries = [...screenTimeEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      } 
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <ScreenTimeGraph data={screenTimeEntries} />
      
      <motion.div 
        className="mt-8 flex flex-col gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="flex justify-between items-center" 
          variants={itemVariants}
        >
          <h2 className="text-2xl font-medium">Screen Time Entries</h2>
          <Button 
            onClick={() => setUploadModalOpen(true)} 
            className="button-hover bg-primary hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Entry
          </Button>
        </motion.div>

        {sortedEntries.length === 0 ? (
          <motion.div 
            className="glassmorphism rounded-xl p-6 flex flex-col items-center justify-center text-center"
            variants={itemVariants}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No entries yet</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Add your first screen time entry by uploading a screenshot and entering the minutes spent.
            </p>
            <Button 
              onClick={() => setUploadModalOpen(true)} 
              variant="outline"
              className="button-hover"
            >
              <Upload className="mr-2 h-4 w-4" /> Upload Screenshot
            </Button>
          </motion.div>
        ) : (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={containerVariants}>
            {sortedEntries.map((entry) => (
              <motion.div
                key={entry.id}
                className="glassmorphism rounded-xl overflow-hidden border border-border shadow-sm card-hover"
                variants={itemVariants}
                layout
              >
                <div className="relative">
                  {entry.screenshotUrl ? (
                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                      <img
                        src={entry.screenshotUrl}
                        alt={`Screenshot from ${entry.date}`}
                        className="w-full h-full object-cover transition-all duration-500 image-loading image-loaded"
                        onLoad={(e) => e.currentTarget.classList.add('image-loaded')}
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <time className="text-sm text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </time>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteEntry(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium">{entry.minutes} minutes</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      <UploadModal 
        isOpen={uploadModalOpen} 
        onClose={() => setUploadModalOpen(false)} 
        onUpload={handleImageUpload} 
        onSelectDate={setSelectedDate}
        selectedDate={selectedDate}
      />
      
      <TimeInputModal 
        isOpen={timeInputModalOpen} 
        onClose={() => setTimeInputModalOpen(false)} 
        onSubmit={handleAddEntry}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default ScreenTimeTracker;
