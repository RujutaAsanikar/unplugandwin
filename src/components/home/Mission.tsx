
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Mission = () => {
  return (
    <section id="mission" className="py-20 px-4 bg-gradient-to-r from-purple-50 to-purple-100">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 purple-gradient-text">Our Mission</h2>
          <div className="mb-12 text-lg leading-relaxed text-gray-700">
            <p className="mb-6">
              Envision a world where youth are empowered and pushed into building meaningful strong connections, discover 
              themselves and their passions, and develop essential life skills outside the digital realm.
            </p>
            <p>
              UnplugAndWin helps to reduce youth social media usage by setting challenges and giving rewards. 
              We aim to foster meaningful connections and encourage real world activities.
            </p>
          </div>
          <div className="flex justify-center gap-6 flex-wrap">
            <Button variant="outline" asChild className="rounded-full border-primary text-primary hover:bg-primary/10">
              <Link to="/survey">For Children</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full border-primary text-primary hover:bg-primary/10">
              <Link to="/survey">For Parents</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Mission;
