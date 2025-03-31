
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import { ScreenTimeEntry } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { 
  updateChallengeProgress, 
  getEntriesCount,
  calculateProgressPercentage
} from '@/lib/challengeManager';
import { addPoints } from '@/lib/pointsManager';

interface UseScreenTimeTrackerProps {
  onPointsEarned: (points: number) => void;
}

export const useScreenTimeTracker = ({ onPointsEarned }: UseScreenTimeTrackerProps) => {
  const [entries, setEntries] = useState<ScreenTimeEntry[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchEntries();
    } else {
      setEntries([]);
    }
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('screen_time_entries')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) {
        console.error("Error fetching entries:", error);
        toast({
          title: "Error",
          description: "Failed to load screen time entries.",
          variant: "destructive",
        });
      } else {
        // Transform the data to match ScreenTimeEntry type
        const formattedEntries = data.map(entry => ({
          id: entry.id,
          date: entry.date,
          minutes: entry.hours * 60, // Convert hours to minutes
          user_id: entry.user_id,
          screenshotUrl: undefined
        }));
        setEntries(formattedEntries);
      }
    } catch (error) {
      console.error("Unexpected error fetching entries:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading entries.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (date: Date, hours: number) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const formattedDate = format(date, 'yyyy-MM-dd');

    try {
      const { data, error } = await supabase
        .from('screen_time_entries')
        .insert([{ 
          user_id: user.id, 
          date: formattedDate, 
          hours: hours 
        }])
        .select()
        .single();

      if (error) {
        console.error("Error adding entry:", error);
        toast({
          title: "Error",
          description: "Failed to add screen time entry.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Screen time entry added successfully!",
        });
        
        fetchEntries();
        
        // Update challenge progress and points
        await updateProgressAndPoints();
      }
    } catch (error) {
      console.error("Unexpected error adding entry:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while adding the entry.",
        variant: "destructive",
      });
    }
  };
  
  const updateProgressAndPoints = async () => {
    if (!user) return;
    
    try {
      // Update challenge progress
      const updatedProgress = await updateChallengeProgress(user.id);
      
      // Get number of entries
      const entriesCount = await getEntriesCount(user.id);
      
      // Calculate the new progress percentage
      const newProgress = calculateProgressPercentage(entriesCount);
      
      // Update points based on progress (1000 points per screenshot)
      const newPoints = Math.min(entriesCount * 1000, 30000);
      
      // Update points in local storage
      const updatedPoints = addPoints(newPoints);
      
      // Notify the dashboard about points earned
      onPointsEarned(updatedPoints.current);
      
      toast({
        title: "Progress updated",
        description: `Challenge progress updated to ${updatedProgress}%.`,
      });
    } catch (error) {
      console.error("Error updating progress and points:", error);
      toast({
        title: "Error",
        description: "Failed to update progress and points.",
        variant: "destructive",
      });
    }
  };

  return {
    entries,
    showAuthModal,
    setShowAuthModal,
    handleSubmit,
    isUserLoggedIn: !!user
  };
};
