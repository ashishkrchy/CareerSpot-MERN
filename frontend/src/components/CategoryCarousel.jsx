import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { setSearchedQuery } from '@/store/jobSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const categories = [
  { name: 'Frontend Developer', icon: '🖥️' },
  { name: 'Backend Developer', icon: '🛠️' },
  { name: 'Blockchain Developer', icon: '⛓️' },
  { name: 'Full Stack Developer', icon: '🧩' },
  { name: 'Android Developer', icon: '🤖' },
  { name: 'Data Engineer', icon: '📊' },
  { name: 'Machine Learning', icon: '🧠' },
  { name: 'DevOps Engineer', icon: '🔄' },
  { name: 'Cloud Architect', icon: '☁️' },
  { name: 'Mobile Developer', icon: '📱' },
  { name: 'UI/UX Designer', icon: '🎨' },
  { name: 'Product Manager', icon: '📋' },
  { name: 'iOS Developer', icon: '' },
];

const CategoryCarousel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    dispatch(setSearchedQuery(category));
    navigate('/browse');
  };

  return (
    <section className="bg-black text-white w-full overflow-x-hidden py-12 sm:py-16">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Heading and Description */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-white">
            Explore{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500">
              Job Categories
            </span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-md sm:max-w-lg mx-auto">
            Browse through our specialized job categories to find your perfect
            match
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 sm:mb-8 max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search categories..."
            aria-label="Search job categories"
            className="pl-10 pr-4 py-3 h-12 bg-gray-900 border-2 border-gray-800 text-white placeholder-gray-500 focus:border-blue-500 rounded-xl text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Carousel */}
        <div className="relative px-12 sm:px-14">
          <Carousel className="w-full">
            <CarouselContent className="flex gap-2 sm:gap-4 py-2">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat, index) => (
                  <CarouselItem key={index} className="basis-auto snap-center">
                    <Button
                      className={`min-w-[160px] sm:min-w-[180px] h-14 sm:h-16 rounded-xl transition-all duration-300 cursor-pointer ${
                        selectedCategory === cat.name
                          ? 'bg-gradient-to-r from-blue-600 to-red-600 text-white shadow-lg'
                          : 'bg-gray-900 border-2 border-gray-800 hover:border-blue-500 text-white hover:bg-gray-800'
                      }`}
                      onClick={() => handleCategoryClick(cat.name)}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-base sm:text-lg">{cat.icon}</span>
                        <span className="font-medium text-sm sm:text-base">
                          {cat.name}
                        </span>
                      </div>
                    </Button>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem className="text-center py-6 sm:py-8 text-gray-400 text-sm sm:text-base">
                  No categories found matching your search
                </CarouselItem>
              )}
            </CarouselContent>

            {/* Navigation Arrows */}
            <CarouselPrevious
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900 border-2 border-gray-800 text-white shadow-lg rounded-full h-10 w-10 hover:bg-gray-800 hover:text-blue-400"
              aria-label="Previous category"
            />
            <CarouselNext
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900 border-2 border-gray-800 text-white shadow-lg rounded-full h-10 w-10 hover:bg-gray-800 hover:text-blue-400"
              aria-label="Next category"
            />
          </Carousel>
        </div>

        {/* Selected Category Indicator */}
        {selectedCategory && (
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              Showing jobs for:{' '}
              <span className="text-blue-400 font-medium">
                {selectedCategory}
              </span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryCarousel;
