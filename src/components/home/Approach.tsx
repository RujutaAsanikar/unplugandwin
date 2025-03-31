
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Approach = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 purple-gradient-text">Our Approach</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Steps to Get Started
          </p>
        </motion.div>
        
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/30 hidden md:block"></div>
          
          <div className="space-y-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold z-10">
                01
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg md:ml-8 flex-1">
                <h3 className="text-xl font-semibold mb-4">Fill the Survey</h3>
                <p className="text-gray-600 mb-4">
                  Complete one of the forms to get started on your digital wellness journey.
                </p>
                <div className="flex gap-4">
                  <Button size="sm" className="rounded-full">Kids</Button>
                  <Button size="sm" variant="outline" className="rounded-full">Parents</Button>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row-reverse items-center gap-8"
            >
              <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold z-10">
                02
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg md:mr-8 flex-1">
                <h3 className="text-xl font-semibold mb-4">The Challenge</h3>
                <p className="text-gray-600">
                  Set up a digital detox challenge and get your screen time tracked to establish a baseline.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold z-10">
                03
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg md:ml-8 flex-1">
                <h3 className="text-xl font-semibold mb-4">Reducing</h3>
                <p className="text-gray-600">
                  Do not lose the challenge and reduce your social media usage to meet your goals.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row-reverse items-center gap-8"
            >
              <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold z-10">
                04
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg md:mr-8 flex-1">
                <h3 className="text-xl font-semibold mb-4">Win</h3>
                <p className="text-gray-600">
                  Complete the challenges and win rewards for your commitment to digital well-being!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Approach;
