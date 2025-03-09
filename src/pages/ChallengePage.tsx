import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Trophy, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import TermsModal from '@/components/TermsModal';
import { useToast } from '@/components/ui/use-toast';
import { 
  getChallengeProgress, 
  startChallenge, 
  isChallengeStarted,
  updateChallengeProgress
} from '@/lib/challengeManager';

const ChallengePage = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const savedChallengeStarted = isChallengeStarted();
    
    if (savedChallengeStarted) {
      setChallengeStarted(true);
      
      const updatedProgress = updateChallengeProgress();
      setChallengeProgress(updatedProgress);
    }
  }, []);

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
        <motion.div
          className="flex flex-col gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold mb-2">30-Day Challenge</h1>
            <p className="text-muted-foreground">Reduce your social media usage and earn up to 30,000 points!</p>
          </motion.div>
          
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
              
              <div>
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
                <p className="text-gray-600">
                  Keep going! Only {remainingPercentage}% more to unlock your next reward! 🎉
                </p>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-xl text-center">
                <p className="font-medium">Challenge In Progress</p>
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
      </main>
    </motion.div>
  );
};

export default ChallengePage;
