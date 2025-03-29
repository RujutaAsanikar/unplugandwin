
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import ScreenTimeTracker from '@/components/ScreenTimeTracker';
import { getUserPoints, saveUserPoints } from '@/lib/pointsManager';
import PointsDisplay from '@/components/PointsDisplay';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TermsModal from '@/components/TermsModal';
import { useToast } from '@/components/ui/use-toast';
import { 
  isChallengeStarted, 
  startChallenge, 
  updateChallengeProgress, 
  getEntriesCount,
  isJustCompleted
} from '@/lib/challengeManager';
import ConfettiOverlay from '@/components/ConfettiOverlay';
import { useAuth } from '@/lib/auth';

const Index = () => {
  const [points, setPoints] = useState(getUserPoints());
  const [showTerms, setShowTerms] = useState(false);
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const savedChallengeStarted = isChallengeStarted();
    setChallengeStarted(savedChallengeStarted);
    
    if (savedChallengeStarted) {
      // If challenge is already started, update the progress
      checkProgress();
    }
    
    setPoints(getUserPoints());
  }, []);

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

  useEffect(() => {
    saveUserPoints(points);
  }, [points]);

  const handlePointsEarned = (earnedPoints: number) => {
    setPoints(prev => ({
      ...prev,
      current: earnedPoints // Use the exact earned points from progress
    }));
    
    // Re-check progress when points are updated
    checkProgress();
  };

  const handleStartChallenge = () => {
    setShowTerms(true);
  };

  const handleAcceptTerms = () => {
    setChallengeStarted(true);
    setShowTerms(false);
    
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
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Header activeTab="Dashboard" />
      <main className="container max-w-6xl mx-auto py-8 pb-20">
        <div className="px-4 mb-6 flex justify-end">
          <PointsDisplay points={points} />
        </div>

        {!challengeStarted && (
          <motion.div 
            variants={itemVariants}
            className="mb-8 mx-4 glassmorphism rounded-xl p-6 border border-primary/30 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
          >
            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                <Trophy className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">Digital Detox Month</h2>
                <Button 
                  className="mt-4 w-full sm:w-auto bg-primary"
                  onClick={handleStartChallenge}
                >
                  Start Challenge
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        <ScreenTimeTracker onPointsEarned={handlePointsEarned} />
        
        <TermsModal 
          isOpen={showTerms} 
          onClose={() => setShowTerms(false)} 
          onAccept={handleAcceptTerms}
          challengeName="Digital Detox Month"
        />
        
        <ConfettiOverlay 
          isVisible={showConfetti} 
          onClose={handleCloseConfetti}
        />
      </main>
    </motion.div>
  );
};

export default Index;
