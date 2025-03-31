
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { getUserPoints, saveUserPoints } from '@/lib/pointsManager';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth';
import DashboardContent from '@/components/dashboard/DashboardContent';
import TermsModal from '@/components/TermsModal';
import ConfettiOverlay from '@/components/ConfettiOverlay';
import AuthModal from '@/components/AuthModal';
import { useChallengeProgress } from '@/hooks/useChallengeProgress';

const Index = () => {
  useEffect(() => {
    document.title = "Dashboard - Unplug And Win";
  }, []);

  const [points, setPoints] = useState(getUserPoints());
  const [showTerms, setShowTerms] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  
  const {
    challengeStarted,
    showConfetti,
    checkProgress,
    handleStartChallenge,
    confirmStartChallenge,
    handleCloseConfetti
  } = useChallengeProgress();

  useEffect(() => {
    setPoints(getUserPoints());
  }, [user]);

  const handlePointsEarned = (earnedPoints: number) => {
    setPoints(prev => ({
      ...prev,
      current: earnedPoints // Use the exact earned points from progress
    }));
    
    // Re-check progress when points are updated
    if (user) {
      checkProgress();
    }
  };

  const onStartChallenge = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowTerms(true);
  };

  const handleAcceptTerms = () => {
    setShowTerms(false);
    confirmStartChallenge();
  };

  useEffect(() => {
    saveUserPoints(points);
  }, [points]);

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Header activeTab="Dashboard" />
      <main className="container max-w-6xl mx-auto py-8 pb-20">
        <DashboardContent 
          user={user}
          points={points}
          challengeStarted={challengeStarted}
          onPointsEarned={handlePointsEarned}
          onStartChallenge={onStartChallenge}
          onLoginClick={() => setShowAuthModal(true)}
        />
        
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
        
        <AuthModal 
          isOpen={showAuthModal} 
          onOpenChange={setShowAuthModal} 
        />
      </main>
    </motion.div>
  );
};

export default Index;
