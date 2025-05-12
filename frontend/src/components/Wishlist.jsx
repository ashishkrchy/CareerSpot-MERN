/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromWishlist } from '@/store/jobSlice';
import toast from 'react-hot-toast';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  HeartOff,
  Briefcase,
  MapPin,
  Clock,
  Calendar,
  Users,
  Building2,
  ArrowLeft,
  IndianRupee,
  ChevronDown,
  Frown,
} from 'lucide-react';

const Wishlist = () => {
  const jobsWishlist = useSelector((store) => store.job.jobWishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRemoveFromWishlist = (jobId) => {
    try {
      dispatch(removeFromWishlist(jobId));
      toast.success('Removed from wishlist', {
        style: {
          background: '#f0fdf4',
          color: '#166534',
          border: '1px solid #bbf7d0',
        },
      });
    } catch (error) {
      toast.error('Failed to remove from wishlist', {
        style: {
          background: '#fef2f2',
          color: '#b91c1c',
          border: '1px solid #fecaca',
        },
      });
    }
  };

  const handleNavigateBack = () => {
    navigate(-1);
  };

  const handleBrowseJobs = () => {
    navigate('/jobs');
  };

  const renderDetailItem = (icon, label, value, highlight = false) => (
    <div className="flex items-center gap-3 p-3 bg-black rounded-lg border border-gray-800 hover:border-blue-600 transition-colors">
      <div className="bg-gray-900 p-2 rounded-lg border border-gray-800">
        {React.cloneElement(icon, {
          className: `h-5 w-5 ${highlight ? 'text-red-500' : 'text-blue-500'}`,
        })}
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <p
          className={`text-white font-medium break-words ${
            highlight ? 'text-red-400' : ''
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black px-4 py-6 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <Button
            onClick={handleNavigateBack}
            variant="ghost"
            className="text-blue-400 hover:text-red-400 flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Badge className="bg-blue-900/30 text-blue-400 border border-blue-800">
            {jobsWishlist.length} {jobsWishlist.length === 1 ? 'Job' : 'Jobs'}
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent mb-2">
          Your Wishlist
        </h1>

        {jobsWishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Frown className="h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-400 mb-6 max-w-md">
              You haven't saved any jobs yet. Browse available positions and
              click the heart icon to save them here.
            </p>
            <Button
              onClick={handleBrowseJobs}
              className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white"
            >
              Browse Jobs
            </Button>
          </div>
        ) : (
          <>
            <p className="text-gray-400 mb-6">
              {jobsWishlist.length} saved{' '}
              {jobsWishlist.length === 1 ? 'job' : 'jobs'}
            </p>

            <div className="space-y-6">
              {jobsWishlist.map((job) => (
                <div
                  key={job._id}
                  className="bg-gray-900/50 rounded-xl p-5 border-2 border-gray-800 hover:border-blue-600 transition-colors"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    {/* Job Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-blue-500/50">
                          <AvatarImage src={job.company?.logo} />
                          <AvatarFallback className="bg-black border border-gray-800">
                            <Building2 className="h-5 w-5 text-blue-500" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-lg sm:text-xl font-bold text-white">
                            {job.title}
                          </h2>
                          <p className="text-blue-400 text-sm sm:text-base">
                            {job.company?.name}
                          </p>
                        </div>
                      </div>

                      {/* Job Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
                        {renderDetailItem(
                          <MapPin />,
                          'Location',
                          job.location || 'Remote',
                          true
                        )}
                        {renderDetailItem(
                          <Clock />,
                          'Experience',
                          job.experience || 'Not specified'
                        )}
                        {renderDetailItem(
                          <IndianRupee />,
                          'Salary',
                          job.salary ? `${job.salary} LPA` : 'Negotiable'
                        )}
                        {renderDetailItem(
                          <Users />,
                          'Applicants',
                          job.applicants?.length || '0',
                          true
                        )}
                        {renderDetailItem(
                          <Calendar />,
                          'Posted',
                          new Date(job.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        )}
                        {renderDetailItem(
                          <Briefcase />,
                          'Job Type',
                          job.jobType,
                          true
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:items-center sm:justify-center gap-3">
                      <Button
                        onClick={() => navigate(`/description/${job._id}`)}
                        className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-bold"
                      >
                        Apply Now <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        className="border-red-600 text-red-500 hover:bg-red-900/30 hover:text-red-400"
                        onClick={() => handleRemoveFromWishlist(job._id)}
                      >
                        <HeartOff className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  {/* Requirements */}
                  {job.requirements?.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-3">
                        Requirements
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {job.requirements.map((req, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-gray-300 text-sm"
                          >
                            <span className="text-red-500 mt-1">▹</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
