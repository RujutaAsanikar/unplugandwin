
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Rewards from '@/components/Rewards';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

const RewardsPage: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Rewards - Unplug And Win";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab="Rewards" />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/home')}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Your Rewards</h1>
          </div>
          <Rewards />
        </div>
      </motion.div>
    </div>
  );
};

export default RewardsPage;
