import React from 'react';
import { Briefcase, MapPin, ArrowRight, IndianRupee } from 'lucide-react';
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const LatestJobs = () => {
  const allJobs = useSelector((state) => state.job.allJobs) || [];
  const [visibleJobs, setVisibleJobs] = React.useState(6);

  const loadMoreJobs = () => {
    setVisibleJobs((prev) => prev + 3);
  };

  return (
    <section className="bg-black w-full py-8 md:py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500">
              Latest & Top
            </span>{' '}
            <span className="text-white">Job Openings</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
            Discover the most exciting career opportunities from leading
            companies worldwide
          </p>
        </div>

        {/* Stats with Icons */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8 md:mb-12">
          <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-800">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <span className="text-gray-300 text-xs md:text-sm">
              <span className="font-bold text-white">{allJobs.length}</span>{' '}
              Jobs Available
            </span>
          </div>
          <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-800">
            <MapPin className="w-4 h-4 text-red-400" />
            <span className="text-gray-300 text-xs md:text-sm">
              <span className="font-bold text-white">Global</span> Opportunities
            </span>
          </div>
          <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-800">
            <IndianRupee className="w-4 h-4 text-blue-400" />
            <span className="text-gray-300 text-xs md:text-sm">
              <span className="font-bold text-white">Competitive</span> Salaries
            </span>
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {allJobs.slice(0, visibleJobs).map((job, i) => (
            <LatestJobCards key={`${job._id || i}`} job={job} />
          ))}
        </div>

        {/* Load More / View All Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center mt-8 md:mt-12 gap-3">
          {visibleJobs < allJobs.length && (
            <button
              onClick={loadMoreJobs}
              className="px-4 py-2 bg-gray-900 text-white rounded-full border border-blue-500 hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <span className="text-sm">Load More</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <Link
            to="/jobs"
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-red-500 text-white rounded-full hover:from-blue-600 hover:to-red-600 transition-all duration-300 shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <span className="text-sm">View All Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestJobs;
