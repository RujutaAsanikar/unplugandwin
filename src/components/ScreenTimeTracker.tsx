import React, { useState, useRef, useEffect } from 'react';
import { ScreenTimeEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Clock, Upload, Image as ImageIcon, X, AlertCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScreenTimeGraph from './ScreenTimeGraph';
import UploadModal from './UploadModal';
import TimeInputModal from './TimeInputModal';
import { useToast } from '@/components/ui/use-toast';
import { updateChallengeProgress, getPointsFromProgress } from '@/lib/challengeManager';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/lib/auth';
import { supabase, getPublicUrl, fileExists } from '@/integrations/supabase/client';
import AuthModal from './AuthModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [imageRefreshKeys, setImageRefreshKeys] = useState<Record<string, number>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user, refreshTrigger]);

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
        .eq('user_id', user.id as string)
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        const formattedEntries: ScreenTimeEntry[] = await Promise.all(data.map(async entry => {
          let screenshotUrl = null;
          
          if (entry.screenshots && entry.screenshots.length > 0) {
            const path = entry.screenshots[0].storage_path;
            const exists = await fileExists('screenshots', path);
            
            if (exists) {
              screenshotUrl = getPublicUrl('screenshots', path);
            }
          }
          
          return {
            id: entry.id,
            date: entry.date,
            minutes: Math.round(entry.hours * 60),
            screenshotUrl
          };
        }));
        
        setScreenTimeEntries(formattedEntries);
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

  const refreshImageUrl = (entryId: string, url: string | undefined) => {
    if (!url) return;
    
    const baseUrl = url.split('?')[0];
    const timestamp = Date.now();
    const newUrl = `${baseUrl}?t=${timestamp}`;
    
    setImageRefreshKeys(prev => ({
      ...prev,
      [entryId]: timestamp
    }));
    
    setScreenTimeEntries(prev => 
      prev.map(entry => 
        entry.id === entryId 
          ? {...entry, screenshotUrl: newUrl} 
          : entry
      )
    );
    
    setImageErrors(prev => {
      const newErrors = {...prev};
      delete newErrors[entryId];
      return newErrors;
    });
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
          .eq('id', existingEntry.id as string);
          
        if (error) throw error;
        
        if (selectedImage) {
          const { data: existingScreenshots } = await supabase
            .from('screenshots')
            .select('id')
            .eq('screen_time_entry_id', existingEntry.id as string);
            
          if (existingScreenshots && existingScreenshots.length > 0) {
            await supabase
              .from('screenshots')
              .delete()
              .eq('screen_time_entry_id', existingEntry.id as string);
          }
          
          const { error: screenshotError } = await supabase
            .from('screenshots')
            .insert({
              screen_time_entry_id: existingEntry.id as string,
              storage_path: selectedImage
            } as any);
            
          if (screenshotError) throw screenshotError;
        }
        
        let screenshotUrlWithCache = null;
        
        if (selectedImage) {
          screenshotUrlWithCache = getPublicUrl('screenshots', selectedImage);
        } else if (existingEntry.screenshotUrl) {
          const baseUrl = existingEntry.screenshotUrl.split('?')[0];
          const timestamp = Date.now();
          screenshotUrlWithCache = `${baseUrl}?t=${timestamp}`;
        }
        
        const updatedEntries = [...screenTimeEntries];
        updatedEntries[existingEntryIndex] = {
          ...existingEntry,
          minutes,
          screenshotUrl: screenshotUrlWithCache
        };
        
        setScreenTimeEntries(updatedEntries);
        
        if (screenshotUrlWithCache) {
          setImageRefreshKeys(prev => ({
            ...prev,
            [existingEntry.id]: Date.now()
          }));
        }
      } else {
        const { data, error } = await supabase
          .from('screen_time_entries')
          .insert({
            user_id: user.id as string,
            date: selectedDate,
            hours
          } as any)
          .select('id')
          .single();
          
        if (error) throw error;
        
        if (selectedImage && data?.id) {
          const { error: screenshotError } = await supabase
            .from('screenshots')
            .insert({
              screen_time_entry_id: data.id as string,
              storage_path: selectedImage
            } as any);
            
          if (screenshotError) throw screenshotError;
        }
        
        let screenshotUrlWithCache = null;
        
        if (selectedImage) {
          screenshotUrlWithCache = getPublicUrl('screenshots', selectedImage);
        }
        
        const newEntry: ScreenTimeEntry = {
          id: data.id as string,
          date: selectedDate,
          minutes,
          screenshotUrl: screenshotUrlWithCache
        };
        
        setScreenTimeEntries([newEntry, ...screenTimeEntries]);
        
        if (screenshotUrlWithCache) {
          setImageRefreshKeys(prev => ({
            ...prev,
            [data.id]: Date.now()
          }));
        }
      }
      
      const updatedProgress = await updateChallengeProgress(user.id as string);
      
      const earnedPoints = await getPointsFromProgress(user.id as string);
      
      if (onPointsEarned) {
        onPointsEarned(earnedPoints);
      }

      setSelectedImage(null);
      setTimeInputModalOpen(false);

      toast({
        title: "Social media time saved",
        description: `You've recorded ${minutes} minutes for ${new Date(selectedDate).toLocaleDateString()}`,
      });
      
      setRefreshTrigger(prev => prev + 1);
      
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

  const confirmDeleteEntry = (id: string) => {
    setEntryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteEntry = async () => {
    if (!user || !entryToDelete) return;
    
    try {
      const { data: entryData, error: entryError } = await supabase
        .from('screen_time_entries')
        .select(`
          id,
          screenshots (id, storage_path)
        `)
        .eq('id', entryToDelete as string)
        .single();
      
      if (entryError) throw entryError;
      
      const { error } = await supabase
        .from('screen_time_entries')
        .delete()
        .eq('id', entryToDelete as string);
        
      if (error) throw error;
      
      if (entryData?.screenshots && entryData.screenshots.length > 0) {
        const storagePath = entryData.screenshots[0].storage_path;
        await supabase.storage
          .from('screenshots')
          .remove([storagePath]);
      }
      
      setScreenTimeEntries(screenTimeEntries.filter(entry => entry.id !== entryToDelete));
      
      toast({
        title: "Entry deleted",
        description: "The social media screen time entry has been removed",
      });
      
      const updatedProgress = await updateChallengeProgress(user.id as string);
      const earnedPoints = await getPointsFromProgress(user.id as string);
      
      if (onPointsEarned) {
        onPointsEarned(earnedPoints);
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: "Failed to delete entry",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
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

  const retryLoadImage = (entryId: string, url: string | undefined) => {
    if (!url) return;
    
    console.log(`Retrying image load for entry ${entryId}`);
    refreshImageUrl(entryId, url);
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
                        <div className="w-full h-full relative">
                          <img
                            src={`${entry.screenshotUrl}&t=${imageRefreshKeys[entry.id] || Date.now()}`}
                            alt={`Screenshot from ${entry.date}`}
                            className="w-full h-full object-contain bg-gray-50"
                            onError={(e) => {
                              const imgElement = e.currentTarget as HTMLImageElement;
                              imgElement.style.display = 'none';
                              const nextElement = imgElement.nextElementSibling as HTMLDivElement;
                              if (nextElement) {
                                nextElement.style.display = 'flex';
                              }
                              handleImageError(entry.id);
                            }}
                            loading="lazy"
                          />
                          <div 
                            className="w-full h-full flex-col items-center justify-center text-gray-400 hidden"
                          >
                            <div className="w-full h-full flex flex-col items-center justify-center">
                              <ImageIcon className="w-8 h-8 mb-2" />
                              <p className="text-sm text-center px-4">Image not available</p>
                              {imageErrors[entry.id] && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => retryLoadImage(entry.id, entry.screenshotUrl)}
                                >
                                  Try Again
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Clock className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-red-500/80 hover:bg-red-600 text-white"
                        onClick={() => confirmDeleteEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="p-3">
                      <time className="text-sm text-gray-700 font-medium block">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
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
        onOpenChange={setAuthModalOpen}
        defaultMode="signup"
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Screen Time Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this entry? This will also remove your progress and points for this entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEntry} className="bg-red-500 hover:bg-red-600 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ScreenTimeTracker;
