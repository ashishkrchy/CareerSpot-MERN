/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Search, ArrowRight, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';

import heroImage1 from '../assets/hero11.jpg';
import heroImage2 from '../assets/hero7.jpg';
import heroImage3 from '../assets/hero10.jpg';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/store/jobSlice';
import { useNavigate } from 'react-router-dom';

const heroImages = [
  { src: heroImage1, alt: 'Team collaborating on project' },
  { src: heroImage2, alt: 'Successful job interview' },
  { src: heroImage3, alt: 'Remote working setup' },
];

const slogans = [
  'Your Career Journey Starts Here',
  'Connecting Talent with Opportunity',
  'Where Skills Meet Their Perfect Match',
];

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      setCurrentSloganIndex((prev) => (prev + 1) % slogans.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchedQuery(searchQuery));
    navigate('/browse');
  };

  return (
    <section className="bg-black text-white w-full overflow-x-hidden py-12 sm:py-16">
      <div className="flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 gap-8">
        {/* Text Content */}
        <div className="text-center flex-1">
          <div className="flex flex-col gap-4 sm:gap-6 items-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="px-4 py-2 rounded-full bg-gray-900 text-red-500 font-medium text-xs sm:text-sm shadow-sm border border-gray-800 flex items-center gap-2"
            >
              <Rocket className="h-4 w-4" />
              <span>No. 1 Job Hunt Platform</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentSloganIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="block mb-2 sm:mb-3"
                >
                  {slogans[currentSloganIndex]}
                </motion.span>
              </AnimatePresence>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500">
                Accelerate Your Career
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-400 max-w-md sm:max-w-xl mx-auto text-sm sm:text-base leading-relaxed"
            >
              Join thousands of professionals who found their dream jobs through
              our platform. Whether you're starting out or leveling up, we've
              got opportunities for every stage of your career journey.
            </motion.p>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex w-full max-w-md sm:max-w-xl shadow-lg border-2 border-gray-800 px-4 py-2 rounded-full items-center gap-2 bg-gray-900 hover:border-blue-500 transition-all duration-300"
            >
              <Search className="h-4 sm:h-5 w-4 sm:w-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Job title, keywords, or company"
                className="flex-1 outline-none border-none text-sm sm:text-base placeholder:text-gray-500 bg-transparent text-white"
              />
              <Button
                type="submit"
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white h-10 sm:h-12 rounded-full shadow-lg hover:scale-105 transition-transform hover:shadow-red-500/20 flex items-center gap-1 cursor-pointer"
              >
                <span className="text-sm sm:text-base">Search</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.form>

            {/* Trending Searches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4 justify-center"
            >
              <span className="text-xs sm:text-sm text-gray-500">
                Trending searches:
              </span>
              {['Software Engineer', 'Product Manager', 'Data Analyst'].map(
                (term, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4"
                  >
                    {term}
                  </Button>
                )
              )}
            </motion.div>
          </div>
        </div>

        {/* Image Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md sm:max-w-lg"
        >
          <Carousel className="w-full">
            <CarouselContent>
              <CarouselItem>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                  >
                    <img
                      src={heroImages[currentImageIndex].src}
                      alt={heroImages[currentImageIndex].alt}
                      className="w-full max-h-64 sm:max-h-80 object-cover rounded-2xl shadow-2xl border-2 border-gray-800"
                    />
                  </motion.div>
                </AnimatePresence>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
