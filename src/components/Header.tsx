import React from 'react';
import { motion } from 'framer-motion';
import { Hand } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  activeTab?: string;
}

const Header: React.FC<HeaderProps> = ({ activeTab = "Dashboard" }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
      <div className="container max-w-6xl mx-auto py-4 px-4 sm:px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="cursor-pointer flex justify-center mb-4"
          onClick={() => navigate('/')}
        >
          <h1 className="text-3xl md:text-4xl font-bold purple-gradient-text whitespace-nowrap">
            Unplug And Win
          </h1>
        </motion.div>
        
        {/* Navigation */}
        <motion.nav 
          className="flex gap-6 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <NavItem 
            label="Dashboard" 
            active={activeTab === "Dashboard"} 
            onClick={() => navigate('/')}
          />
          <NavItem 
            label="Challenges" 
            active={activeTab === "Challenges"} 
            onClick={() => navigate('/challenges')}
          />
        </motion.nav>
      </div>
    </header>
  );
};

interface NavItemProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ label, active = false, onClick }: NavItemProps) => {
  return (
    <div 
      className={`px-3 py-2 rounded-lg cursor-pointer transition-all font-medium
        ${active 
          ? 'text-primary' 
          : 'text-gray-500 hover:text-gray-800'
        }`}
      onClick={onClick}
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
