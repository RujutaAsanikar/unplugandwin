
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 purple-gradient-text">
              UnplugAndWin
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Reclaim your life from digital distractions and unlock rewards by participating in our screen time reduction challenges.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90 shadow-lg">
                <Link to="/survey" className="flex items-center">
                  Get Started <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="rounded-full border-primary text-primary hover:bg-primary/10">
                <Link to="#mission">Our Mission</Link>
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            variants={fadeInUp}
            className="relative hidden lg:flex justify-center"
          >
            <div className="bg-purple-200 rounded-full w-64 h-64 absolute top-0 right-0"></div>
            <div className="bg-lime-200 rounded-full w-48 h-48 absolute bottom-0 left-0"></div>
            <div className="bg-white p-8 rounded-2xl shadow-xl z-10 relative glassmorphism">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-primary/10 p-6 rounded-xl text-center">
                  <h3 className="font-semibold text-lg mb-2">Kids</h3>
                  <p className="text-sm text-gray-600">
                    Take on exciting challenges, earn rewards, and have fun with friends!
                  </p>
                </div>
                <div className="bg-primary/10 p-6 rounded-xl text-center">
                  <h3 className="font-semibold text-lg mb-2">Parents</h3>
                  <p className="text-sm text-gray-600">
                    Help your children balance screen time with real-life activities.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
