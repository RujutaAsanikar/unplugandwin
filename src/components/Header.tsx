
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, DollarSign, Info, Home } from 'lucide-react';
import AuthButton from './AuthButton';

interface HeaderProps {
  activeTab: 'Home' | 'Dashboard' | 'Challenges' | 'Rewards' | 'Admin';
}

const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const location = useLocation();
  
  const headerLinks = [
    { name: 'Home', path: '/home', icon: Info },
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Challenges', path: '/challenges', icon: Trophy },
    { name: 'Rewards', path: '/rewards', icon: DollarSign },
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="font-bold text-xl md:text-2xl text-primary tracking-tight whitespace-nowrap px-1">UnplugAndWin</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8 items-center">
            {headerLinks.map((link) => {
              const isActive = activeTab === link.name;
              const Icon = link.icon;
              
              return (
                <Link 
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-1 py-2 px-1 relative ${
                    isActive 
                      ? 'text-primary font-medium' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
          
          <div className="flex items-center">
            <AuthButton />
          </div>
        </div>
      </div>
      
      <div className="md:hidden border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between py-2">
            {headerLinks.map((link) => {
              const isActive = activeTab === link.name;
              const Icon = link.icon;
              
              return (
                <Link 
                  key={link.name}
                  to={link.path}
                  className={`flex flex-1 flex-col items-center py-2 ${
                    isActive 
                      ? 'text-primary font-medium' 
                      : 'text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs">{link.name}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTabMobile"
                      className="absolute bottom-0 h-0.5 w-1/4 bg-primary"
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
