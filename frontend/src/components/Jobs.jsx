import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import FilterCard from './FilterCard';
import { useSelector } from 'react-redux';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Skeleton } from './ui/skeleton';

const Jobs = () => {
  useGetAllJobs();
  const { allJobs, loading } = useSelector((state) => state.job);

  const [filters, setFilters] = useState({
    location: '',
    role: '',
    salary: '',
  });

  const parseSalary = (salaryStr) => {
    if (!salaryStr || typeof salaryStr !== 'string') return 0;

    salaryStr = salaryStr.toLowerCase().replace(/\s+/g, '');

    if (salaryStr.includes('k')) {
      const num = parseFloat(salaryStr);
      return isNaN(num) ? 0 : num / 100;
    }

    if (salaryStr.includes('lakh') || salaryStr.includes('l')) {
      const num = parseFloat(salaryStr);
      return isNaN(num) ? 0 : num;
    }

    const num = parseFloat(salaryStr);
    return isNaN(num) ? 0 : num;
  };

  const filteredJobs = allJobs.filter((job) => {
    const locationMatch =
      filters.location === '' ||
      job.company?.location
        ?.toLowerCase()
        .includes(filters.location.toLowerCase());

    const roleMatch =
      filters.role === '' ||
      job.title?.toLowerCase().includes(filters.role.toLowerCase());

    const numericSalary = parseSalary(job.salary);
    let salaryMatch = true;

    switch (filters.salary) {
      case '0-10':
        salaryMatch = numericSalary >= 0 && numericSalary < 10;
        break;
      case '10-20':
        salaryMatch = numericSalary >= 10 && numericSalary < 20;
        break;
      case '20-30':
        salaryMatch = numericSalary >= 20 && numericSalary < 30;
        break;
      case '30+':
        salaryMatch = numericSalary >= 30;
        break;
      default:
        salaryMatch = true;
    }

    return locationMatch && roleMatch && salaryMatch;
  });

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto mt-5 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Sidebar Filter */}
          <div className="w-full lg:w-1/5">
            <FilterCard filters={filters} setFilters={setFilters} />
          </div>

          {/* Job Listings */}
          {loading ? (
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-80 w-full bg-gray-800 rounded-xl"
                  />
                ))}
              </div>
            </div>
          ) : filteredJobs.length <= 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-white text-xl font-medium bg-gray-800 p-4 rounded-lg border border-red-500/50">
                No jobs found matching your criteria.
              </span>
            </div>
          ) : (
            <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pr-2">
                {filteredJobs.map((job) => (
                  <div
                    key={job._id}
                    className="hover:scale-[1.02] transition-transform duration-300 h-full"
                  >
                    <Job job={job} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
