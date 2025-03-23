
// Challenge manager to track and update challenge progress
import { supabase } from '@/integrations/supabase/client';

// Calculate the progress percentage based on the number of entries
export const calculateProgressPercentage = (entriesCount: number): number => {
  if (entriesCount === 0) return 0;
  
  // First screenshot is worth 11%
  if (entriesCount === 1) return 11;
  
  // Each subsequent screenshot (up to 30 total) adds 3%
  const subsequentProgress = Math.min(entriesCount - 1, 29) * 3;
  
  // Cap total progress at 100%
  return Math.min(11 + subsequentProgress, 100);
};

// Get the current challenge progress from localStorage
export const getChallengeProgress = (): { completed: number; active: number; pointsEarned: number } => {
  // Try to get the saved challenge progress data
  const savedProgressData = localStorage.getItem('challengeProgressData');
  
  if (savedProgressData) {
    try {
      return JSON.parse(savedProgressData);
    } catch (e) {
      console.error('Error parsing challenge progress data:', e);
    }
  }
  
  // Return default values if no data exists or there was an error parsing
  return {
    completed: 0,
    active: 1,
    pointsEarned: 0
  };
};

// Save challenge progress data to localStorage
export const saveChallengeProgressData = (data: { completed: number; active: number; pointsEarned: number }): void => {
  localStorage.setItem('challengeProgressData', JSON.stringify(data));
};

// Save simple challenge progress percentage to localStorage (for backward compatibility)
export const saveChallengeProgress = (progress: number): void => {
  localStorage.setItem('challengeProgress', progress.toString());
  
  // Also update the progress data if needed
  const progressData = getChallengeProgress();
  if (progress === 100 && progressData.completed === 0) {
    // When a challenge is completed, update the completed count and points
    saveChallengeProgressData({
      ...progressData,
      completed: progressData.completed + 1,
      pointsEarned: progressData.pointsEarned + 1000
    });
  }
};

// Get entries count from Supabase or localStorage
export const getEntriesCount = async (userId?: string): Promise<number> => {
  if (userId) {
    try {
      const { data, error } = await supabase
        .from('screen_time_entries')
        .select('id')
        .eq('user_id', userId);
        
      if (error) throw error;
      return data?.length || 0;
    } catch (error) {
      console.error('Error fetching entries count:', error);
      return 0;
    }
  } else {
    // Fallback to localStorage if no userId
    const savedEntries = localStorage.getItem('screenTimeEntries');
    const entries = savedEntries ? JSON.parse(savedEntries) : [];
    const uniqueDates = new Set(entries.map((entry: any) => entry.date));
    return uniqueDates.size;
  }
};

// Check if challenge was just completed
export const isJustCompleted = (previousProgress: number, newProgress: number): boolean => {
  return previousProgress < 100 && newProgress === 100;
};

// Update challenge progress based on screenshot count
export const updateChallengeProgress = async (userId?: string): Promise<number> => {
  // Get previous progress
  const previousProgress = Number(localStorage.getItem('challengeProgress') || '0');
  
  // Get number of entries
  const entriesCount = await getEntriesCount(userId);
  
  // Calculate the new progress percentage
  const newProgress = calculateProgressPercentage(entriesCount);
  
  // Save the updated progress
  saveChallengeProgress(newProgress);
  
  // Update points based on progress (1000 points per screenshot)
  if (entriesCount > 0) {
    // Update points - 1000 points per screenshot
    const currentPoints = JSON.parse(localStorage.getItem('userPoints') || '{"current":0,"target":30000}');
    const newPoints = Math.min(entriesCount * 1000, 30000);
    
    if (currentPoints.current !== newPoints) {
      localStorage.setItem('userPoints', JSON.stringify({
        ...currentPoints,
        current: newPoints
      }));
    }
  }
  
  // If challenge is completed (100%), record it in admin tracking
  if (newProgress === 100 && userId) {
    await recordChallengeCompletion(userId);
  }
  
  return newProgress;
};

// Record challenge completion for admin tracking
export const recordChallengeCompletion = async (userId: string): Promise<void> => {
  try {
    // Check if this user has already been recorded
    const { data: existingData } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .single();
      
    if (!existingData) {
      // Store in localStorage as backup
      const completionsStr = localStorage.getItem('challengeCompletions') || '[]';
      const completions = JSON.parse(completionsStr);
      
      if (!completions.includes(userId)) {
        completions.push(userId);
        localStorage.setItem('challengeCompletions', JSON.stringify(completions));
      }
    }
  } catch (error) {
    console.error('Error recording challenge completion:', error);
  }
};

// Check if the challenge has been started
export const isChallengeStarted = (): boolean => {
  return localStorage.getItem('challengeStarted') === 'true';
};

// Start the challenge
export const startChallenge = (): void => {
  localStorage.setItem('challengeStarted', 'true');
  localStorage.setItem('challengeProgress', '0');
  
  // Initialize the challenge progress data
  saveChallengeProgressData({
    completed: 0,
    active: 1,
    pointsEarned: 0
  });
};

// Calculate remaining screenshots needed for reward
export const getRemainingScreenshots = async (userId?: string): Promise<number> => {
  const entriesCount = await getEntriesCount(userId);
  return Math.max(0, 30 - entriesCount);
};

// Calculate points earned from challenge progress
export const getPointsFromProgress = async (userId?: string): Promise<number> => {
  const entriesCount = await getEntriesCount(userId);
  return Math.min(entriesCount * 1000, 30000);
};
