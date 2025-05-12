/* eslint-disable no-unused-vars */
import React from 'react';
import { MapPin, Briefcase, IndianRupee, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const FilterCard = ({ filters, setFilters }) => {
  const locationOptions = [
    'Remote',
    'Delhi NCR',
    'Bangalore',
    'Hyderabad',
    'Pune',
    'Mumbai',
  ];
  const jobRoleOptions = [
    'Frontend Developer',
    'Backend Developer',
    'FullStack Developer',
  ];
  const salaryOptions = ['0-10', '10-20', '20-30', '30+'];

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type] === value ? '' : value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      location: '',
      role: '',
      salary: '',
    });
  };

  const hasActiveFilters = filters.location || filters.role || filters.salary;

  const parseSalary = (salaryStr) => {
    if (!salaryStr) return 0;

    const numericValue = parseFloat(salaryStr.replace(/[^0-9.]/g, ''));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  const formatSalaryOption = (range) => {
    if (range === '30+') return '30+ LPA';
    return `${range} LPA`;
  };

  return (
    <div className="w-full bg-gray-900 p-6 rounded-xl border-2 border-gray-800 shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
            Filters
          </span>
        </h1>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-red-400 hover:text-red-500 flex items-center gap-1 cursor-pointer"
          >
            <X className="h-4 w-4" />
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Location Filter */}
        <div>
          <h2 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            <span className="bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent">
              Location
            </span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {locationOptions.map((loc) => (
              <Badge
                key={loc}
                variant={filters.location === loc ? 'default' : 'outline'}
                className={`cursor-pointer transition-all ${
                  filters.location === loc
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={() => handleFilterChange('location', loc)}
              >
                {loc}
              </Badge>
            ))}
          </div>
        </div>

        {/* Job Role Filter */}
        <div>
          <h2 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-500" />
            <span className="bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
              Job Role
            </span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {jobRoleOptions.map((role) => (
              <Badge
                key={role}
                variant={filters.role === role ? 'default' : 'outline'}
                className={`cursor-pointer transition-all ${
                  filters.role === role
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={() => handleFilterChange('role', role)}
              >
                {role}
              </Badge>
            ))}
          </div>
        </div>

        {/* Salary Filter */}
        <div>
          <h2 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-blue-500" />
            <span className="bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
              Salary Range
            </span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {salaryOptions.map((range) => (
              <Badge
                key={range}
                variant={filters.salary === range ? 'default' : 'outline'}
                className={`cursor-pointer transition-all ${
                  filters.salary === range
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={() => handleFilterChange('salary', range)}
              >
                {formatSalaryOption(range)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-800">
            <h3 className="text-sm font-medium text-gray-400 mb-2">
              Active Filters
            </h3>
            <div className="flex flex-wrap gap-2">
              {filters.location && (
                <Badge className="bg-blue-600/20 text-blue-400 border border-blue-500 flex items-center gap-1">
                  {filters.location}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() =>
                      handleFilterChange('location', filters.location)
                    }
                  />
                </Badge>
              )}
              {filters.role && (
                <Badge className="bg-red-600/20 text-red-400 border border-red-500 flex items-center gap-1">
                  {filters.role}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange('role', filters.role)}
                  />
                </Badge>
              )}
              {filters.salary && (
                <Badge className="bg-purple-600/20 text-purple-400 border border-purple-500 flex items-center gap-1">
                  {formatSalaryOption(filters.salary)}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange('salary', filters.salary)}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterCard;
