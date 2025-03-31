
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const Rewards = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-purple-50 to-purple-100">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 purple-gradient-text">Rewards</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Incentivizing participants for reducing their usage is what we are pushing here for. 
            Parents will first reward participants and make them take on these challenges.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-8 shadow-lg"
          >
            <div className="flex items-center mb-4">
              <Star className="w-6 h-6 text-yellow-400 mr-2" />
              <h3 className="text-xl font-semibold">Cash Prizes</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Enjoy the freedom to spend your reward as you wish with our generous cash prizes. 
              Whether you're saving for a big purchase or treating yourself to something special, 
              our cash rewards give you the flexibility to choose.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-8 shadow-lg"
          >
            <div className="flex items-center mb-4">
              <Star className="w-6 h-6 text-yellow-400 mr-2" />
              <h3 className="text-xl font-semibold">Event Tickets</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Get access to the most exciting events around! From concerts and sports games 
              to theater performances and exclusive shows, our event tickets promise 
              unforgettable experiences.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-8 shadow-lg"
          >
            <div className="flex items-center mb-4">
              <Star className="w-6 h-6 text-yellow-400 mr-2" />
              <h3 className="text-xl font-semibold">Travel Experiences</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Go on an adventure of a lifetime with our travel experiences. Discover new 
              destinations, immerse yourself in different cultures, and create memories that will 
              last forever.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-8 shadow-lg"
          >
            <div className="flex items-center mb-4">
              <Star className="w-6 h-6 text-yellow-400 mr-2" />
              <h3 className="text-xl font-semibold">Educational Opportunities</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Invest in your future with our educational opportunities. Whether it's a course, 
              workshop, or a full-fledged program, expand your knowledge and skills with 
              top-notch educational resources.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Rewards;
