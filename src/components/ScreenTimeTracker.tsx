
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { ScreenTimeEntry } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import AuthModal from './AuthModal';
import { 
  updateChallengeProgress, 
  getEntriesCount,
  calculateProgressPercentage
} from '@/lib/challengeManager';
import { addPoints } from '@/lib/pointsManager';

const ScreenTimeTracker: React.FC<{ onPointsEarned: (points: number) => void }> = ({ onPointsEarned }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hours, setHours] = useState<number | ''>('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !hours) {
      toast({
        title: "Error",
        description: "Please select a date and enter the number of hours.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const formattedDate = format(date, 'yyyy-MM-dd');
    const hoursNumber = Number(hours);

    if (isNaN(hoursNumber) || hoursNumber <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid number of hours.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('screen_time_entries')
        .insert([{ 
          user_id: user.id, 
          date: formattedDate, 
          hours: hoursNumber 
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
        
        // Clear the form
        setHours('');
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

  return (
    <motion.div
      className="glassmorphism rounded-xl p-6 border border-primary/30 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4">Track Your Screen Time</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) =>
                  date > new Date() || date < new Date('2024-01-01')
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Input
            type="number"
            placeholder="Hours"
            value={hours}
            onChange={(e) => setHours(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-24"
          />
        </div>
        <Button type="submit" className="w-full bg-primary">
          Add Entry
        </Button>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Your Entries</h3>
        {entries.length === 0 ? (
          <p className="text-muted-foreground">No entries yet. Start tracking your screen time!</p>
        ) : (
          <ul className="space-y-2">
            {entries.map((entry) => (
              <li key={entry.id} className="text-sm">
                {format(new Date(entry.date), 'PPP')}: {entry.minutes / 60} hours
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onOpenChange={setShowAuthModal} 
        defaultMode="signup" 
      />
    </motion.div>
  );
};

export default ScreenTimeTracker;
