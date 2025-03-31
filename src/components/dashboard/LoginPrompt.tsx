
import React from 'react';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoginPromptProps {
  onLoginClick: () => void;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ onLoginClick }) => {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
          } 
        }
      }}
      className="mb-8 mx-4 glassmorphism rounded-xl p-6 border border-primary/30 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
    >
      <div className="flex flex-col items-center text-center p-8">
        <LogIn className="w-12 h-12 mb-4 text-primary" />
        <h2 className="text-2xl font-semibold mb-4">Sign in to access your Dashboard</h2>
        <p className="text-gray-600 mb-6">
          You need to be signed in to track your progress, participate in challenges, and earn rewards.
        </p>
        <Button onClick={onLoginClick} className="bg-primary">
          Sign in or Register
        </Button>
      </div>
    </motion.div>
  );
};

export default LoginPrompt;
