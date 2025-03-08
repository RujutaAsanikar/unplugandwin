
import React from 'react';
import { Challenge } from '@/lib/types';
import { motion } from 'framer-motion';
import { Award, Check, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChallengesProps {
  onSelectChallenge?: (challenge: Challenge) => void;
}

const Challenges: React.FC<ChallengesProps> = ({ onSelectChallenge }) => {
  // Sample challenges
  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Screen-Free Morning',
      description: 'Avoid social media for the first hour after waking up',
      target: 60,
      duration: 'daily',
      completed: false
    },
    {
      id: '2',
      title: 'Digital Detox Evening',
      description: 'Reduce screen time by 30 minutes before bed',
      target: 30,
      duration: 'daily',
      completed: false
    },
    {
      id: '3',
      title: 'Weekend Warrior',
      description: 'Cut your weekend screen time by 25%',
      target: 120,
      duration: 'weekly',
      completed: false
    },
    {
      id: '4',
      title: 'Focus Mode',
      description: 'Limit social media to just 15 minutes during study hours',
      target: 15,
      duration: 'daily',
      completed: false
    }
  ];

  // Animation variants
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
    <div className="mt-8">
      <motion.div 
        className="flex flex-col gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-medium mb-2">Challenges</h2>
          <p className="text-muted-foreground">Take on these challenges to build healthier digital habits.</p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
        >
          {challenges.map((challenge) => (
            <motion.div
              key={challenge.id}
              className="glassmorphism rounded-xl p-5 border border-border shadow-sm card-hover"
              variants={itemVariants}
            >
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 
                        ${challenge.duration === 'daily' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'}`}>
                        {challenge.duration === 'daily' ? 'Daily' : 'Weekly'} Challenge
                      </span>
                      <h3 className="font-medium">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Save {challenge.target} min</span>
                    </div>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary hover:bg-primary/10 -mr-2"
                    >
                      <span className="mr-1">Details</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Challenges;
