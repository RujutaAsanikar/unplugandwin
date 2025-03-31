
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Hero from '@/components/home/Hero';
import Mission from '@/components/home/Mission';
import ImpactAreas from '@/components/home/ImpactAreas';
import Rewards from '@/components/home/Rewards';
import Approach from '@/components/home/Approach';
import Contact from '@/components/home/Contact';
import Footer from '@/components/home/Footer';

const HomePage = () => {
  useEffect(() => {
    document.title = "Unplug And Win";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/10">
      <Header activeTab="Home" />
      <Hero />
      <Mission />
      <ImpactAreas />
      <Rewards />
      <Approach />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;
