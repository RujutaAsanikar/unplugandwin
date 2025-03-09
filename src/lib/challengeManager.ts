
// Challenge manager to track and update challenge progress

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
export const getChallengeProgress = (): number => {
  return parseInt(localStorage.getItem('challengeProgress') || '0');
};

// Save challenge progress to localStorage
export const saveChallengeProgress = (progress: number): void => {
  localStorage.setItem('challengeProgress', progress.toString());
};

// Update challenge progress based on screenshot count
export const updateChallengeProgress = (): number => {
  // Get current screen time entries
  const savedEntries = localStorage.getItem('screenTimeEntries');
  const entries = savedEntries ? JSON.parse(savedEntries) : [];
  
  // Calculate unique days with screenshots
  const uniqueDates = new Set(entries.map((entry: any) => entry.date));
  const entriesCount = uniqueDates.size;
  
  // Calculate the new progress percentage
  const newProgress = calculateProgressPercentage(entriesCount);
  
  // Save the updated progress
  saveChallengeProgress(newProgress);
  
  return newProgress;
};

// Check if the challenge has been started
export const isChallengeStarted = (): boolean => {
  return localStorage.getItem('challengeStarted') === 'true';
};

// Start the challenge
export const startChallenge = (): void => {
  localStorage.setItem('challengeStarted', 'true');
  localStorage.setItem('challengeProgress', '0');
};
