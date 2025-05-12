import React from 'react';
import { Briefcase, MapPin, ArrowRight, IndianRupee } from 'lucide-react';
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const LatestJobs = () => {
  const allJobs = useSelector((state) => state.job.allJobs);
  const [visibleJobs, setVisibleJobs] = React.useState(6);

  const loadMoreJobs = () => {
    setVisibleJobs((prev) => prev + 3);
  };

  return (
    <div className="bg-black py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500">
              Latest & Top
            </span>{' '}
            <span className="text-white">Job Openings</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover the most exciting career opportunities from leading
            companies worldwide
          </p>
        </div>

        {/* Stats with Icons */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800">
            <Briefcase className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300">
              <span className="font-bold text-white">{allJobs.length}</span>{' '}
              Jobs Available
            </span>
          </div>
          <div className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800">
            <MapPin className="w-5 h-5 text-red-400" />
            <span className="text-gray-300">
              <span className="font-bold text-white">Global</span> Opportunities
            </span>
          </div>
          <div className="flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800">
            <IndianRupee className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300">
              <span className="font-bold text-white">Competitive</span> Salaries
            </span>
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {allJobs.slice(0, visibleJobs).map((job, i) => (
            <LatestJobCards key={`${job._id || i}`} job={job} />
          ))}
        </div>

        {/* Load More / View All Buttons */}
        <div className="flex justify-center mt-12 gap-4">
          {visibleJobs < allJobs.length && (
            <button
              onClick={loadMoreJobs}
              className="px-6 py-2 bg-gray-900 text-white rounded-full border border-blue-500 hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-300 flex items-center gap-2"
            >
              Load More <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <Link
            to="/jobs"
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-red-500 text-white rounded-full hover:from-blue-600 hover:to-red-600 transition-all duration-300 shadow-lg flex items-center gap-2"
          >
            View All Jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LatestJobs;
