
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
import { ScreenTimeEntry } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  useEffect(() => {
    document.title = "Dashboard - Unplug And Win";
  }, []);

  const [points, setPoints] = useState(getUserPoints());
  const [showTerms, setShowTerms] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [screenTimeEntries, setScreenTimeEntries] = useState<ScreenTimeEntry[]>([]);
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

  useEffect(() => {
    if (user) {
      fetchScreenTimeEntries();
    }
  }, [user]);

  const fetchScreenTimeEntries = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('screen_time_entries')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) {
        console.error("Error fetching entries:", error);
      } else {
        // Transform the data to match ScreenTimeEntry type
        const formattedEntries = data.map(entry => ({
          id: entry.id,
          date: entry.date,
          minutes: entry.hours * 60, // Convert hours to minutes
          user_id: entry.user_id,
          screenshotUrl: undefined
        }));
        setScreenTimeEntries(formattedEntries);
      }
    } catch (error) {
      console.error("Unexpected error fetching entries:", error);
    }
  };

  const handlePointsEarned = (earnedPoints: number) => {
    setPoints(prev => ({
      ...prev,
      current: earnedPoints // Use the exact earned points from progress
    }));
    
    // Re-check progress when points are updated
    if (user) {
      checkProgress();
      fetchScreenTimeEntries(); // Refresh screen time data when points are earned
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
