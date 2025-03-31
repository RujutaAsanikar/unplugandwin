
import React from 'react';
import { motion } from 'framer-motion';
import AuthModal from './AuthModal';
import ScreenTimeEntryForm from './screenTime/ScreenTimeEntryForm';
import ScreenTimeEntriesList from './screenTime/ScreenTimeEntriesList';
import { useScreenTimeTracker } from '@/hooks/useScreenTimeTracker';

const ScreenTimeTracker: React.FC<{ onPointsEarned: (points: number) => void }> = ({ onPointsEarned }) => {
  const {
    entries,
    showAuthModal,
    setShowAuthModal,
    handleSubmit,
    isUserLoggedIn
  } = useScreenTimeTracker({ onPointsEarned });

  return (
    <motion.div
      className="glassmorphism rounded-xl p-6 border border-primary/30 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4">Track Your Screen Time</h2>
      
      <ScreenTimeEntryForm 
        onSubmit={handleSubmit}
        isUserLoggedIn={isUserLoggedIn}
      />

      <ScreenTimeEntriesList entries={entries} />
      
      <AuthModal 
        isOpen={showAuthModal} 
        onOpenChange={setShowAuthModal} 
        defaultMode="signup" 
      />
    </motion.div>
  );
};

export default ScreenTimeTracker;
