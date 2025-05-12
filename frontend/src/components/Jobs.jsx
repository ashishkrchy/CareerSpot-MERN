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

      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Mobile Filter Toggle (hidden on desktop) */}
          <div className="lg:hidden mb-4">
            <details className="bg-gray-900 rounded-lg border border-gray-700">
              <summary className="px-4 py-3 text-white font-medium cursor-pointer">
                Filter Jobs
              </summary>
              <div className="p-4 border-t border-gray-700">
                <FilterCard filters={filters} setFilters={setFilters} mobile />
              </div>
            </details>
          </div>

          {/* Sidebar Filter (hidden on mobile) */}
          <div className="hidden lg:block w-full lg:w-1/4 xl:w-1/5">
            <FilterCard filters={filters} setFilters={setFilters} />
          </div>

          {/* Job Listings */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-80 w-full bg-gray-800 rounded-lg"
                  />
                ))}
              </div>
            ) : filteredJobs.length <= 0 ? (
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center p-6 bg-gray-800 rounded-lg border border-red-500/50">
                  <p className="text-white text-lg md:text-xl font-medium">
                    No jobs found matching your criteria.
                  </p>
                  <button
                    onClick={() =>
                      setFilters({ location: '', role: '', salary: '' })
                    }
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredJobs.map((job) => (
                  <div
                    key={job._id}
                    className="hover:scale-[1.02] transition-transform duration-300"
                  >
                    <Job job={job} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
