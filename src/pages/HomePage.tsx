
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';
import { Sparkles, Star, Globe, GraduationCap, ExternalLink, ArrowRight } from 'lucide-react';

const HomePage = () => {
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

  const handleParentClick = () => {
    window.open('https://forms.gle/hsgiKmkmsbwKg22V7', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/10">
      <Header activeTab="Home" />
      
      {/* Hero Section */}
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
      
      {/* Mission Section */}
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
              <Button 
                variant="outline" 
                className="rounded-full border-primary text-primary hover:bg-primary/10"
                asChild
              >
                <Link to="/survey">For Children</Link>
              </Button>
              <Button 
                variant="outline" 
                className="rounded-full border-primary text-primary hover:bg-primary/10"
                onClick={handleParentClick}
              >
                For Parents
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Impact Areas */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/80 to-primary">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Impact Areas</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-lg text-center"
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Mental Health</h3>
              <p className="text-gray-600">
                Reducing screen time to lower stress and anxiety while enhancing emotional resilience
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-lg text-center"
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Social Relationships</h3>
              <p className="text-gray-600">
                Building stronger in-person relationships and improving face-to-face communication skills
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-lg text-center"
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Academic Performance</h3>
              <p className="text-gray-600">
                Enhancing focus, concentration, and time management by minimizing digital distractions
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Rewards Section */}
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
      
      {/* Our Approach */}
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
                    <Button size="sm" className="rounded-full" asChild>
                      <Link to="/survey">Kids</Link>
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-full" onClick={handleParentClick}>
                      Parents
                    </Button>
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
      
      {/* Contact Section */}
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
      
      {/* Footer */}
      <footer className="py-10 px-4 bg-gray-900 text-white text-center">
        <div className="container mx-auto">
          <p>© UnplugAndWin 2024. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
