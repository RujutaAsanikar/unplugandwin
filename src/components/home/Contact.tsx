
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Contact = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-primary/80 to-primary text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Reach Out to Us</h2>
            <div className="space-y-4 mb-8">
              <p className="flex items-center">
                <span className="font-semibold mr-2">Phone:</span> 412-254-3880
              </p>
              <p className="flex items-center">
                <span className="font-semibold mr-2">Email:</span> Info@UnplugAndWin.com
              </p>
              <p className="flex items-center">
                <span className="font-semibold mr-2">Address:</span> 16 Hemingway St, Pittsburgh, PA 15213
              </p>
            </div>
            <Button variant="outline" className="bg-white text-primary hover:bg-gray-100">
              Contact Us <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/10 p-8 rounded-xl backdrop-blur-sm"
          >
            <h3 className="text-2xl font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm">First name *</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Last name *</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm">Email *</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Company</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm">Write a message</label>
                <textarea 
                  rows={4} 
                  className="w-full px-4 py-2 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                ></textarea>
              </div>
              
              <Button className="w-full bg-white text-primary hover:bg-gray-100">
                Submit
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
