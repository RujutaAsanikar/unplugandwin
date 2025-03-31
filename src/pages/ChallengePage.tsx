
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Trophy, CheckCircle, Upload, Shield, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import TermsModal from '@/components/TermsModal';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { 
  getChallengeProgress, 
  startChallenge, 
  isChallengeStarted,
  updateChallengeProgress,
  getRemainingScreenshots,
  getEntriesCount
} from '@/lib/challengeManager';
import { supabase } from '@/integrations/supabase/client';
import ConfettiOverlay from '@/components/ConfettiOverlay';

const ChallengePage = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [remainingScreenshots, setRemainingScreenshots] = useState(30);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedRecently, setCompletedRecently] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedChallengeStarted = isChallengeStarted();
    
    if (savedChallengeStarted) {
      setChallengeStarted(true);
      loadProgress();
    }

    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  useEffect(() => {
    if (challengeProgress === 100 && !completedRecently) {
      setCompletedRecently(true);
      setShowConfetti(true);
    }
  }, [challengeProgress]);

  useEffect(() => {
    if (challengeStarted && user) {
      checkForCompletion();
    }
  }, [challengeStarted, user]);

  const checkForCompletion = async () => {
    if (!user) return;
    
    try {
      const entriesCount = await getEntriesCount(user.id);
      if (entriesCount >= 30) {
        const updatedProgress = await updateChallengeProgress(user.id);
        setChallengeProgress(100);
        
        const hasSeenCompletionCelebration = localStorage.getItem('hasSeenCompletionCelebration');
        if (hasSeenCompletionCelebration !== 'true') {
          setShowConfetti(true);
        }
      }
    } catch (error) {
      console.error("Error checking completion:", error);
    }
  };

  const loadProgress = async () => {
    const updatedProgress = await updateChallengeProgress(user?.id);
    setChallengeProgress(updatedProgress);
    
    const remaining = await getRemainingScreenshots(user?.id);
    setRemainingScreenshots(remaining);
    
    const entriesCount = await getEntriesCount(user?.id);
    if (entriesCount >= 30) {
      setChallengeProgress(100);
      setRemainingScreenshots(0);
      
      const hasSeenCompletionCelebration = localStorage.getItem('hasSeenCompletionCelebration');
      if (hasSeenCompletionCelebration !== 'true') {
        setShowConfetti(true);
      }
    }
  };

  const checkAdminStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('is_admin', { user_id: user.id });
      
      if (error) throw error;
      
      setIsAdmin(!!data);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
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

  const remainingPercentage = 100 - challengeProgress;

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Header activeTab="Challenges" />
      <main className="container max-w-4xl mx-auto py-8 pb-20 px-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">30-Day Challenge</h1>
        </div>
        
        {isAdmin && (
          <div className="mb-6">
            <Button asChild variant="outline" className="gap-2">
              <Link to="/admin">
                <Shield className="h-4 w-4" />
                Admin Dashboard
              </Link>
            </Button>
          </div>
        )}
        
        <motion.div
          className="flex flex-col gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {!challengeStarted ? (
            <motion.div 
              variants={itemVariants}
              className="glassmorphism rounded-xl p-6 border border-primary/30 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
            >
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">Digital Detox Month</h2>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">30 days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-primary" />
                      <span className="text-gray-600">Earn up to 30,000 points</span>
                    </div>
                    <Button 
                      className="mt-4 w-full sm:w-auto bg-primary"
                      onClick={handleStartChallenge}
                    >
                      Start Challenge
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              variants={itemVariants}
              className="glassmorphism rounded-xl p-6 border border-primary/30 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Digital Detox Month</h2>
                </div>
              </div>
              
              <div className="flex items-center gap-4 my-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">1 month</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-600">Active</span>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Progress</h3>
                  <span>{challengeProgress}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${challengeProgress}%` }} 
                  />
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-primary/5 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <h3 className="font-medium text-lg text-primary">Reward Progress</h3>
                </div>
                {challengeProgress < 100 ? (
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      {remainingScreenshots > 0 ? (
                        <>You need to upload <strong>{remainingScreenshots} more screenshot{remainingScreenshots !== 1 ? 's' : ''}</strong> to complete the challenge!</>
                      ) : (
                        <>Almost there! Complete your uploads to unlock your reward.</>
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button asChild size="sm" variant="outline" className="gap-1">
                        <Link to="/">
                          <Upload className="h-3 w-3 mr-1" />
                          Upload Screenshots
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-green-600 font-medium">
                      Challenge completed! 🎉
                    </p>
                    <p className="text-gray-600 mt-1">
                      You've earned the full 30,000 points reward!
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-xl text-center">
                <p className="font-medium">
                  {challengeProgress >= 100 ? "Challenge Completed" : "Challenge In Progress"}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        <TermsModal 
          isOpen={showTerms} 
          onClose={() => setShowTerms(false)} 
          onAccept={handleAcceptTerms}
          challengeName="Digital Detox Month"
        />

        <ConfettiOverlay 
          isVisible={showConfetti} 
          onClose={() => handleCloseConfetti()} 
        />
      </main>
    </motion.div>
  );
};

export default ChallengePage;
