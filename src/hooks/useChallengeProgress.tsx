
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { 
  isChallengeStarted, 
  startChallenge, 
  updateChallengeProgress, 
  getEntriesCount,
  isJustCompleted
} from '@/lib/challengeManager';
import { useToast } from '@/components/ui/use-toast';

export const useChallengeProgress = () => {
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const savedChallengeStarted = isChallengeStarted();
    setChallengeStarted(savedChallengeStarted);
    
    if (savedChallengeStarted && user) {
      // If challenge is already started, update the progress
      checkProgress();
    }
  }, [user]);

  const checkProgress = async () => {
    const previousProgress = Number(localStorage.getItem('challengeProgress') || '0');
    const updatedProgress = await updateChallengeProgress(user?.id);
    setChallengeProgress(updatedProgress);
    
    // Check if the challenge was just completed
    if (isJustCompleted(previousProgress, updatedProgress)) {
      setShowConfetti(true);
    }
    
    // Check for completion even if it happened earlier
    const entriesCount = await getEntriesCount(user?.id);
    if (entriesCount >= 30 && updatedProgress === 100) {
      // For users who may have refreshed after completing
      const hasSeenCompletionCelebration = localStorage.getItem('hasSeenCompletionCelebration');
      if (hasSeenCompletionCelebration !== 'true') {
        setShowConfetti(true);
        localStorage.setItem('hasSeenCompletionCelebration', 'true');
      }
    }
  };

  const handleStartChallenge = () => {
    if (!user) {
      return false;
    }
    
    return true;
  };

  const confirmStartChallenge = () => {
    setChallengeStarted(true);
    startChallenge();
    
    toast({
      title: "Challenge started!",
      description: "You've successfully started the 30-day social media reduction challenge",
    });
  };

  const handleCloseConfetti = () => {
    setShowConfetti(false);
    localStorage.setItem('hasSeenCompletionCelebration', 'true');
  };

  return {
    challengeStarted,
    showConfetti,
    challengeProgress,
    checkProgress,
    handleStartChallenge,
    confirmStartChallenge,
    handleCloseConfetti
  };
};
