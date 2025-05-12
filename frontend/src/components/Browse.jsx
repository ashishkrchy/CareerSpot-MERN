import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useSelector } from 'react-redux';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const Browse = () => {
  useGetAllJobs();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    jobType: '',
    experience: '',
    salaryRange: '',
  });

  const searchedQuery = useSelector((store) => store.job.searchedQuery);

  const allJobs = useSelector((store) => store.job.allJobs);

  const jobTypes = ['full-time', 'part-time', 'contract', 'internship'];
  const experienceLevels = ['0-1 years', '1-2 years', '2-3 years', '3+ years'];
  const salaryRanges = ['0-10', '10-20', '20-30', '30+'];

  const clearFilters = () => {
    setFilters({
      jobType: '',
      experience: '',
      salaryRange: '',
    });
  };

  const filteredJobs = allJobs.filter((job) => {
    const jobTitle = job?.title?.toLowerCase() || '';
    const companyName = job?.company?.name?.toLowerCase() || '';
    const jobType = job?.jobType?.toLowerCase() || '';
    const experience = job?.experience?.toLowerCase() || '';
    const salary = parseFloat(job?.salary || '0');

    const searchTerm = searchQuery || searchedQuery || '';
    const searchTermLower = searchTerm.toLowerCase();

    const matchesSearch = searchTermLower
      ? jobTitle.includes(searchTermLower) ||
        companyName.includes(searchTermLower)
      : true;

    const matchesJobType = filters.jobType
      ? jobType === filters.jobType.toLowerCase()
      : true;

    const matchesExperience = filters.experience
      ? experience === filters.experience.toLowerCase()
      : true;

    const matchesSalary =
      filters.salaryRange && !isNaN(salary)
        ? (() => {
            if (filters.salaryRange === '30+') return salary >= 30;
            const [min, max] = filters.salaryRange.split('-').map(Number);
            return salary >= min && salary <= max;
          })()
        : true;

    return (
      matchesSearch && matchesJobType && matchesExperience && matchesSalary
    );
  });

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent">
              Browse Jobs
            </span>
          </h1>

          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for jobs or companies"
              className="pl-10 pr-4 py-6 bg-gray-900 border-2 border-gray-800 text-white placeholder-gray-500 focus:border-blue-500 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters Header */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-400">
              Showing{' '}
              <span className="text-blue-400">{filteredJobs.length}</span>{' '}
              results
            </p>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-gray-800 text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
              {showFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Job Type */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">
                    Job Type
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {jobTypes.map((type) => (
                      <Badge
                        key={type}
                        variant={
                          filters.jobType === type ? 'default' : 'outline'
                        }
                        className={`cursor-pointer ${
                          filters.jobType === type
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'border-gray-700 text-gray-300 hover:bg-gray-800'
                        }`}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            jobType: prev.jobType === type ? '' : type,
                          }))
                        }
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">
                    Experience
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {experienceLevels.map((level) => (
                      <Badge
                        key={level}
                        variant={
                          filters.experience === level ? 'default' : 'outline'
                        }
                        className={`cursor-pointer ${
                          filters.experience === level
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'border-gray-700 text-gray-300 hover:bg-gray-800'
                        }`}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            experience: prev.experience === level ? '' : level,
                          }))
                        }
                      >
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Salary Range */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">
                    Salary Range (LPA)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {salaryRanges.map((range) => (
                      <Badge
                        key={range}
                        variant={
                          filters.salaryRange === range ? 'default' : 'outline'
                        }
                        className={`cursor-pointer ${
                          filters.salaryRange === range
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : 'border-gray-700 text-gray-300 hover:bg-gray-800'
                        }`}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            salaryRange:
                              prev.salaryRange === range ? '' : range,
                          }))
                        }
                      >
                        {range === '30+' ? '30+ LPA' : `${range} LPA`}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {(filters.jobType ||
                filters.experience ||
                filters.salaryRange) && (
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="ghost"
                    className="text-gray-400 hover:text-red-500 flex items-center gap-1"
                    onClick={clearFilters}
                  >
                    <X className="h-4 w-4" />
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Job List */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-medium text-gray-400 mb-2">
              No jobs found
            </h2>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filters
            </p>
            <Button
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
              onClick={clearFilters}
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, index) => (
              <div
                key={job._id || index}
                className="hover:scale-[1.02] transition-transform duration-300"
              >
                <Job job={job} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
