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

  const daysAgo = (mongoTime) => {
    const date = new Date(mongoTime);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'Today' : `${diffDays} days ago`;
  };

  const dispatch = useDispatch();

  const handleWishlist = async () => {
    if (!user) {
      toast.error('Failed to add, Login First!', {
        style: {
          background: '#fef2f2',
          color: '#b91c1c',
          border: '1px solid #fecaca',
        },
      });
      return;
    }

    dispatch(setJobWishlist(job));
    toast.success('Job successfully added to wishlist!');
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not disclosed';
    else if (typeof salary === 'string' && salary.includes('L')) return salary;
    else return `${salary} LPA`;
  };

  return (
    <div className="p-5 rounded-xl shadow-lg bg-gray-900 border border-gray-700 hover:border-blue-500 hover:shadow-blue-500/20 transition-all duration-300 h-95 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{daysAgo(job.updatedAt)}</p>
        <Button
          variant="outline"
          className="rounded-full border border-gray-600 hover:bg-gray-800 p-2 hover:text-blue-500 cursor-pointer"
          size="icon"
        >
          <Bookmark className="w-4 h-4 text-blue-600" />
        </Button>
      </div>

      {/* Company Info */}
      <div className="flex items-center gap-4 my-4">
        <Avatar className="w-12 h-12 border border-blue-500/30">
          <AvatarImage
            src={job.company?.logo || 'https://via.placeholder.com/100'}
            className="object-contain bg-white rounded-full p-1"
          />
          <AvatarFallback className="bg-gray-800 text-white">
            {job.company?.name?.charAt(0).toUpperCase() || 'C'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-medium text-lg text-white">
            {job.company?.name || 'Company'}
          </h2>
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{job.company?.location || 'Location not specified'}</span>
          </div>
        </div>
      </div>

      {/* Job Title and Description */}
      <div className="flex-1 overflow-hidden">
        <h2 className="font-bold text-lg mb-1 text-white line-clamp-1">
          {job.title || 'Job Title'}
        </h2>
        <p className="text-gray-300 text-sm line-clamp-3">
          {job.description || 'No description provided'}
        </p>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <Badge className="text-blue-400 bg-blue-900/30 hover:bg-blue-900/40 font-medium flex items-center gap-1">
          <Briefcase className="w-3 h-3" />
          {job.position || 0} positions
        </Badge>
        <Badge className="text-red-400 bg-red-900/30 hover:bg-red-900/40 font-medium">
          {job.jobType || 'Full-time'}
        </Badge>
        <Badge className="text-white bg-green-700/50 hover:bg-green-900/40 font-medium">
          {job.experience || '1-2 years'}
        </Badge>
        <Badge className="text-blue-400 bg-blue-900/30 hover:bg-blue-900/40 font-medium flex items-center gap-1">
          <IndianRupee className="w-3 h-3" />
          {formatSalary(job.salary)}
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
