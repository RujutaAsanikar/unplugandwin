
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { UserPoints } from '@/lib/types';

interface PointsDisplayProps {
  points: UserPoints;
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({ points }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full"
    >
      <Trophy className="h-4 w-4 text-primary" />
      <span className="font-medium text-primary">{points.current.toLocaleString()} / {points.target.toLocaleString()} pts</span>
    </motion.div>
  );
};

export default PointsDisplay;
