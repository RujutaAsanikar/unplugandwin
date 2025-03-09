
import React, { useState, useRef } from 'react';
import { ScreenTimeEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Clock, Upload, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScreenTimeGraph from './ScreenTimeGraph';
import UploadModal from './UploadModal';
import TimeInputModal from './TimeInputModal';
import { useToast } from '@/components/ui/use-toast';

interface ScreenTimeTrackerProps {
  onPointsEarned?: (points: number) => void;
}

const ScreenTimeTracker: React.FC<ScreenTimeTrackerProps> = ({ onPointsEarned }) => {
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
      
      // Award points for new entries
      if (onPointsEarned) {
        onPointsEarned(1000);
      }
    }

    // Reset states
    setSelectedImage(null);
    setTimeInputModalOpen(false);

    toast({
      title: "Social media time saved",
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
      description: "The social media screen time entry has been removed",
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
    <div className="w-full max-w-4xl mx-auto px-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 w-full"
      >
        <h1 className="text-2xl font-bold mb-4">Social Media Usage Tracker</h1>
      </motion.div>

      {/* Display Screen Time Graph First */}
      <ScreenTimeGraph data={screenTimeEntries} />

      {/* Screenshots Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glassmorphism p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Social Media Screen Time</h2>
          <Button 
            onClick={() => setUploadModalOpen(true)} 
            variant="outline"
            className="button-hover"
          >
            <Upload className="mr-2 h-4 w-4" /> Upload Screenshot
          </Button>
        </div>

        {sortedEntries.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No screenshots uploaded yet. Add your first social media screen time entry.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sortedEntries.map((entry) => (
              <motion.div
                key={entry.id}
                className="overflow-hidden rounded-lg border border-gray-100 shadow-sm"
                layout
              >
                <div className="relative aspect-video bg-gray-50">
                  {entry.screenshotUrl ? (
                    <img
                      src={entry.screenshotUrl}
                      alt={`Screenshot from ${entry.date}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Clock className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>
                
                <div className="p-3">
                  <time className="text-xs text-gray-500 block">
                    {new Date(entry.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </time>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-primary" />
                    <span className="text-sm font-medium">{entry.minutes} minutes</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Track Time Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glassmorphism p-6"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Smartphone className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Track Your Social Media Usage</h2>
            <p className="text-gray-500">Enter your daily social media screen time to track your progress</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Today's Social Media Time</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => setTimeInputModalOpen(true)}
              size="lg" 
              className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
            >
              <Clock className="mr-2 h-5 w-5" /> Log Time
            </Button>
          </div>
        </div>
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
