
import React, { useState, useRef, useEffect } from 'react';
import { ScreenTimeEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Clock, Upload, Image, X, AlertCircle, ImageOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScreenTimeGraph from './ScreenTimeGraph';
import UploadModal from './UploadModal';
import TimeInputModal from './TimeInputModal';
import { useToast } from '@/components/ui/use-toast';
import { updateChallengeProgress, getPointsFromProgress } from '@/lib/challengeManager';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import AuthModal from './AuthModal';

interface ScreenTimeTrackerProps {
  onPointsEarned?: (points: number) => void;
}

const ScreenTimeTracker: React.FC<ScreenTimeTrackerProps> = ({ onPointsEarned }) => {
  const [screenTimeEntries, setScreenTimeEntries] = useState<ScreenTimeEntry[]>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [timeInputModalOpen, setTimeInputModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('screen_time_entries')
        .select(`
          id,
          date,
          hours,
          screenshots (id, storage_path)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        const formattedEntries: ScreenTimeEntry[] = data.map(entry => ({
          id: entry.id,
          date: entry.date,
          minutes: Math.round(entry.hours * 60),
          screenshotUrl: entry.screenshots && entry.screenshots.length > 0 
            ? entry.screenshots[0].storage_path 
            : undefined
        }));
        
        setScreenTimeEntries(formattedEntries);
        
        // Preload images to check for errors
        formattedEntries.forEach(entry => {
          if (entry.screenshotUrl) {
            const img = new Image();
            img.onload = () => {
              console.log(`Successfully loaded image for entry ${entry.id}`);
            };
            img.onerror = () => {
              console.error(`Failed to load image for entry ${entry.id}: ${entry.screenshotUrl}`);
              setImageErrors(prev => ({
                ...prev,
                [entry.id]: true
              }));
            };
            img.crossOrigin = "anonymous";
            img.src = entry.screenshotUrl;
          }
        });
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast({
        title: "Failed to load entries",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEntry = async (minutes: number) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    
    try {
      const hours = minutes / 60;
      
      const existingEntryIndex = screenTimeEntries.findIndex(
        entry => entry.date === selectedDate
      );
      
      if (existingEntryIndex !== -1) {
        const existingEntry = screenTimeEntries[existingEntryIndex];
        
        const { error } = await supabase
          .from('screen_time_entries')
          .update({ hours })
          .eq('id', existingEntry.id);
          
        if (error) throw error;
        
        if (selectedImage) {
          const { error: screenshotError } = await supabase
            .from('screenshots')
            .insert({
              screen_time_entry_id: existingEntry.id,
              storage_path: selectedImage
            });
            
          if (screenshotError) throw screenshotError;
        }
        
        const updatedEntries = [...screenTimeEntries];
        updatedEntries[existingEntryIndex] = {
          ...existingEntry,
          minutes,
          screenshotUrl: selectedImage || existingEntry.screenshotUrl
        };
        
        setScreenTimeEntries(updatedEntries);
      } else {
        const { data, error } = await supabase
          .from('screen_time_entries')
          .insert({
            user_id: user.id,
            date: selectedDate,
            hours
          })
          .select('id')
          .single();
          
        if (error) throw error;
        
        if (selectedImage && data.id) {
          const { error: screenshotError } = await supabase
            .from('screenshots')
            .insert({
              screen_time_entry_id: data.id,
              storage_path: selectedImage
            });
            
          if (screenshotError) throw screenshotError;
        }
        
        const newEntry: ScreenTimeEntry = {
          id: data.id,
          date: selectedDate,
          minutes,
          screenshotUrl: selectedImage
        };
        
        setScreenTimeEntries([newEntry, ...screenTimeEntries]);
        
        // Update the challenge progress based on the new entry
        const updatedProgress = await updateChallengeProgress(user.id);
        
        // Get the points from the progress
        const earnedPoints = await getPointsFromProgress(user.id);
        
        // Notify parent component about earned points
        if (onPointsEarned) {
          onPointsEarned(earnedPoints);
        }
      }

      setSelectedImage(null);
      setTimeInputModalOpen(false);

      toast({
        title: "Social media time saved",
        description: `You've recorded ${minutes} minutes for ${new Date(selectedDate).toLocaleDateString()}`,
      });
    } catch (error) {
      console.error('Error adding entry:', error);
      toast({
        title: "Failed to save entry",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    console.log('Image uploaded:', imageUrl);
    setSelectedImage(imageUrl);
    setUploadModalOpen(false);
    setTimeInputModalOpen(true);
  };

  const handleDeleteEntry = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('screen_time_entries')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setScreenTimeEntries(screenTimeEntries.filter(entry => entry.id !== id));
      
      toast({
        title: "Entry deleted",
        description: "The social media screen time entry has been removed",
      });
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: "Failed to delete entry",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleAddScreenTime = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    
    setUploadModalOpen(true);
  };

  const handleImageError = (entryId: string) => {
    console.log(`Image error detected for entry ${entryId}`);
    setImageErrors(prev => ({
      ...prev,
      [entryId]: true
    }));
  };

  const retryLoadImage = (entryId: string, url: string) => {
    console.log(`Retrying image load for entry ${entryId}`);
    setImageErrors(prev => {
      const newErrors = {...prev};
      delete newErrors[entryId];
      return newErrors;
    });
    
    // Force browser to reload image by adding a cache-busting parameter
    const cacheBustUrl = `${url}?t=${Date.now()}`;
    
    const img = new Image();
    img.onload = () => {
      // Image loaded successfully, update the entry
      setScreenTimeEntries(prev => 
        prev.map(entry => 
          entry.id === entryId 
            ? {...entry, screenshotUrl: cacheBustUrl} 
            : entry
        )
      );
    };
    img.onerror = () => {
      // Image still failing to load
      setImageErrors(prev => ({
        ...prev,
        [entryId]: true
      }));
    };
    img.crossOrigin = "anonymous";
    img.src = cacheBustUrl;
  };

  const sortedEntries = [...screenTimeEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
        className="flex-1 w-full text-center sm:text-left"
      >
        <h1 className="text-2xl font-bold mb-4 whitespace-nowrap">Social Media Usage Tracker</h1>
      </motion.div>

      <ScreenTimeGraph data={screenTimeEntries} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glassmorphism p-6"
      >
        <div className="flex flex-col items-center mb-4">
          <h2 className="text-xl font-semibold mb-2 sm:mb-0 whitespace-nowrap">Social Media Screen Time</h2>
          <Button 
            onClick={handleAddScreenTime} 
            variant="outline"
            className="button-hover w-full sm:w-auto mt-2"
          >
            <Upload className="mr-2 h-4 w-4" /> Upload Screenshot
          </Button>
        </div>

        {!user && (
          <div className="text-center p-4 bg-primary/5 rounded-lg mb-4">
            <AlertCircle className="mx-auto h-6 w-6 text-primary mb-2" />
            <p className="text-sm font-medium mb-2">Track your screen time</p>
            <Button 
              onClick={() => setAuthModalOpen(true)}
              className="bg-primary hover:bg-primary/90"
              size="sm"
            >
              Sign In / Sign Up
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-10">
            <div className="h-8 w-8 mx-auto mb-4 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Loading your entries...</p>
          </div>
        ) : (
          <>
            {sortedEntries.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                {user 
                  ? "No screenshots uploaded yet. Add your first social media screen time entry."
                  : "Sign in to start tracking your social media usage."
                }
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {sortedEntries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    className="overflow-hidden rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
                    layout
                  >
                    <div className="relative aspect-video bg-gray-50">
                      {entry.screenshotUrl ? (
                        <>
                          {!imageErrors[entry.id] ? (
                            <img
                              src={entry.screenshotUrl}
                              alt={`Screenshot from ${entry.date}`}
                              className="w-full h-full object-contain bg-gray-50"
                              onError={() => handleImageError(entry.id)}
                              crossOrigin="anonymous"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                              <ImageOff className="w-8 h-8 mb-2" />
                              <p className="text-xs text-center">Image could not be loaded</p>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="mt-2"
                                onClick={() => entry.screenshotUrl && retryLoadImage(entry.id, entry.screenshotUrl)}
                              >
                                Retry
                              </Button>
                            </div>
                          )}
                        </>
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
          </>
        )}
      </motion.div>
      
      <TimeInputModal 
        isOpen={timeInputModalOpen} 
        onClose={() => setTimeInputModalOpen(false)} 
        onSubmit={handleAddEntry}
        selectedDate={selectedDate}
      />
      
      <UploadModal 
        isOpen={uploadModalOpen} 
        onClose={() => setUploadModalOpen(false)} 
        onUpload={handleImageUpload} 
        onSelectDate={setSelectedDate}
        selectedDate={selectedDate}
      />
      
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode="signup"
      />
    </div>
  );
};

export default ScreenTimeTracker;
