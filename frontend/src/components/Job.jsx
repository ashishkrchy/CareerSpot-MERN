import React from 'react';
import { Button } from './ui/button';
import { Bookmark, IndianRupee, MapPin, Briefcase } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setJobWishlist } from '@/store/jobSlice';
import toast from 'react-hot-toast';

const Job = ({ job }) => {
  const user = useSelector((store) => store.auth.user);
  const dispatch = useDispatch();

  const daysAgo = (mongoTime) => {
    const date = new Date(mongoTime);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'Today' : `${diffDays} days ago`;
  };

  const handleWishlist = async (e) => {
    e.stopPropagation(); // Prevent card click from triggering
    if (!user) {
      toast.error('Please login to add jobs to your wishlist', {
        style: {
          background: '#fef2f2',
          color: '#b91c1c',
          border: '1px solid #fecaca',
        },
      });
      return;
    }
    dispatch(setJobWishlist(job));
    toast.success('Added to wishlist!');
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not disclosed';
    if (typeof salary === 'string' && salary.includes('L')) return salary;
    return `${salary} LPA`;
  };

  return (
    <div
      className="p-4 sm:p-5 rounded-lg sm:rounded-xl bg-gray-900 border border-gray-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 flex flex-col h-full"
      onClick={() => (window.location.href = `/description/${job._id}`)}
      role="link"
      aria-label={`View details for ${job.title || 'Job Title'} at ${
        job.company?.name || 'Company'
      }`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <p className="text-xs text-gray-400">{daysAgo(job.updatedAt)}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleWishlist}
          className="p-1.5 sm:p-2 h-8 sm:h-10 w-8 sm:w-10 rounded-full hover:bg-gray-800 hover:text-blue-400"
          aria-label="Add to wishlist"
        >
          <Bookmark className="w-4 sm:w-5 h-4 sm:h-5 text-blue-500" />
        </Button>
      </div>

      {/* Company Info */}
      <div className="flex items-center gap-3 mb-3 sm:mb-4">
        <Avatar className="w-10 sm:w-12 h-10 sm:h-12 border border-blue-500/30">
          <AvatarImage
            src={job.company?.logo || 'https://via.placeholder.com/100'}
            className="object-contain bg-white rounded-full p-1"
            alt={job.company?.name || 'Company logo'}
          />
          <AvatarFallback className="bg-gray-800 text-white text-sm sm:text-base">
            {job.company?.name?.charAt(0).toUpperCase() || 'C'}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2 className="font-medium text-base sm:text-lg text-white truncate">
            {job.company?.name || 'Company'}
          </h2>
          <div className="flex items-center gap-1 text-gray-400 text-xs sm:text-sm">
            <MapPin className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
            <span className="truncate">
              {job.company?.location || 'Location not specified'}
            </span>
          </div>
        </div>
      </div>

      {/* Job Title and Description */}
      <div className="flex-1 overflow-hidden mb-3 sm:mb-4">
        <h2 className="font-bold text-base sm:text-lg mb-1 text-white truncate">
          {job.title || 'Job Title'}
        </h2>
        <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
          {job.description || 'No description provided'}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
        <Badge
          variant="secondary"
          className="text-blue-400 bg-blue-900/30 px-1.5 sm:px-2 py-0.5 text-xs max-w-[calc(50%-0.25rem)] sm:max-w-[calc(25%-0.5rem)]"
        >
          <Briefcase className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
          <span className="truncate">{job.position || 0} pos</span>
        </Badge>
        <Badge
          variant="secondary"
          className="text-red-400 bg-red-900/30 px-1.5 sm:px-2 py-0.5 text-xs max-w-[calc(50%-0.25rem)] sm:max-w-[calc(25%-0.5rem)]"
        >
          <span className="truncate">{job.jobType || 'Full-time'}</span>
        </Badge>
        <Badge
          variant="secondary"
          className="text-green-400 bg-green-900/30 px-1.5 sm:px-2 py-0.5 text-xs max-w-[calc(50%-0.25rem)] sm:max-w-[calc(25%-0.5rem)]"
        >
          <span className="truncate">{job.experience || '1-2 yrs'}</span>
        </Badge>
        <Badge
          variant="secondary"
          className="text-blue-400 bg-blue-900/30 px-1.5 sm:px-2 py-0.5 text-xs max-w-[calc(50%-0.25rem)] sm:max-w-[calc(25%-0.5rem)]"
        >
          <IndianRupee className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
          <span className="truncate">{formatSalary(job.salary)}</span>
        </Badge>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 mt-4">
        <Button
          variant="outline"
          className="border-gray-600 hover:border-blue-500 hover:text-blue-400 text-white flex-1"
        >
          <Link
            to={`/description/${job._id}`}
            className="w-full h-full flex items-center justify-center"
          >
            Details
          </Link>
        </Button>
        <Button
          className="bg-gradient-to-r from-blue-600 to-red-600 text-white hover:from-blue-700 hover:to-red-700 shadow-lg flex-1 cursor-pointer"
          onClick={handleWishlist}
        >
          Add to Wishlist
        </Button>
      </div>
    </div>
  );
};

export default Job;
