
import React from 'react';
import { motion } from 'framer-motion';
import { Hand } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full border-b border-gray-100">
      {/* Top banner */}
      <div className="w-full bg-gray-50 py-2 px-4 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          MAKE EVERY MOMENT A REWARD
        </motion.p>
      </div>
      
      {/* Main header */}
      <div className="container max-w-6xl mx-auto py-4 px-4 sm:px-6 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-3xl md:text-4xl font-bold purple-gradient-text">
            Unplug And Win
          </h1>
        </motion.div>
        
        {/* Navigation */}
        <motion.nav 
          className="flex gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <NavItem label="Dashboard" active />
          <NavItem label="Challenges" />
          <NavItem label="Rewards" />
        </motion.nav>
      </div>
    </header>
  );
};

interface NavItemProps {
  label: string;
  active?: boolean;
}

const NavItem = ({ label, active = false }: NavItemProps) => {
  return (
    <div 
      className={`px-3 py-2 rounded-lg cursor-pointer transition-all font-medium
        ${active 
          ? 'text-primary' 
          : 'text-gray-500 hover:text-gray-800'
        }`}
    >
      <span>{label}</span>
      {active && (
        <motion.div 
          className="h-0.5 bg-primary mt-1"
          layoutId="navIndicator"
        />
      )}
    </div>
  );
};

export default Header;
