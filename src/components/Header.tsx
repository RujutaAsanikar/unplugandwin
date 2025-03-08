
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Award, Star } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-6 px-4 sm:px-6 flex flex-col items-center justify-center mb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <div className="inline-block px-3 py-1 mb-2 rounded-full text-xs font-medium bg-primary/10 text-primary">
          Digital Wellbeing
        </div>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground mb-2">
          Mindful Metrics
        </h1>
        <p className="text-muted-foreground max-w-[500px] text-balance">
          Track your screen time, take on challenges, and earn rewards as you develop healthier digital habits.
        </p>
      </motion.div>
      
      <motion.div 
        className="flex gap-6 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <NavItem icon={<Clock className="w-5 h-5" />} label="Tracker" active />
        <NavItem icon={<Award className="w-5 h-5" />} label="Challenges" />
        <NavItem icon={<Star className="w-5 h-5" />} label="Rewards" />
      </motion.div>
    </header>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem = ({ icon, label, active = false }: NavItemProps) => {
  return (
    <div 
      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg cursor-pointer transition-all
        ${active 
          ? 'text-primary' 
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
        }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
      {active && (
        <motion.div 
          className="w-1 h-1 rounded-full bg-primary mt-1"
          layoutId="navIndicator"
        />
      )}
    </div>
  );
};

export default Header;
