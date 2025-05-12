import React from 'react';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Clock,
  MapPin,
  DollarSign,
  Briefcase,
  Award,
  Zap,
  IndianRupee,
} from 'lucide-react';

const LatestJobCards = ({ job }) => {
  const companyName = job?.company?.name || 'Company Name';
  const companyLocation = job?.company?.location || 'Location not specified';
  const jobTitle = job?.title || 'Job Title';
  const jobDescription = job?.description || 'No description provided';
  const position = job?.position || 0;
  const jobType = job?.jobType || 'Job type not specified';
  const salary = job?.salary || 'Salary not specified';
  const experience = job?.experience || 'Experience not specified';
  const requirements = job?.requirements || [];
  const skills = job?.skills || [];
  const postedDate = job?.createdAt
    ? new Date(job.createdAt).toLocaleDateString()
    : 'Recently';

  const formatSalary = (salary) => {
    if (!salary) return 'Salary not disclosed';

    if (typeof salary === 'string') {
      if (salary.includes('LPA') || salary.includes('lpa')) {
        return salary;
      }

      if (salary.includes('-')) {
        return `${salary} LPA`;
      }

      if (!isNaN(salary)) {
        return `${salary} LPA`;
      }
      return salary;
    }

    if (typeof salary === 'number') {
      return `${salary} LPA`;
    }

    return 'Salary not disclosed';
  };

  const formattedSalary = formatSalary(salary);

  return (
    <div className="group p-5 rounded-xl bg-gray-900 border border-gray-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer h-full flex flex-col">
      {/* Company Info */}
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="w-12 h-12 border-2 border-blue-500/30 group-hover:border-blue-500 transition-all">
          <AvatarImage
            src={job.company?.logo || 'https://via.placeholder.com/100'}
            className="object-contain bg-white p-1"
          />
          <AvatarFallback className="bg-gray-800 text-white">
            {companyName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-medium text-lg text-white group-hover:text-blue-400 transition-colors">
            {companyName}
          </h2>
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{companyLocation}</span>
          </div>
        </div>
      </div>

      {/* Job Info */}
      <div className="flex-grow">
        <h1 className="font-bold text-xl text-white mb-2 group-hover:text-blue-400 transition-colors">
          {jobTitle}
        </h1>
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
          {jobDescription}
        </p>

        {/* Posted Date */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
          <Clock className="w-3 h-3" />
          <span>Posted: {postedDate}</span>
        </div>

        {/* Requirements */}
        {requirements.length > 0 && (
          <div className="mb-4">
            <h3 className="text-red-400 text-sm font-medium mb-2 flex items-center gap-1">
              <Zap className="w-4 h-4" /> Requirements
            </h3>
            <div className="flex flex-wrap gap-2">
              {requirements.slice(0, 3).map((req, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-blue-400 border-blue-400/30 bg-blue-400/10 hover:bg-blue-400/20 transition-colors py-1 px-2 text-xs"
                >
                  {req}
                </Badge>
              ))}
              {requirements.length > 3 && (
                <Badge className="text-gray-400 bg-gray-800 text-xs">
                  +{requirements.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-4">
            <h3 className="text-blue-400 text-sm font-medium mb-2 flex items-center gap-1">
              <Award className="w-4 h-4" /> Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 3).map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-red-400 border-red-400/30 bg-red-400/10 hover:bg-red-400/20 transition-colors py-1 px-2 text-xs"
                >
                  {skill}
                </Badge>
              ))}
              {skills.length > 3 && (
                <Badge className="text-gray-400 bg-gray-800 text-xs">
                  +{skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Job Details Badges */}
      <div className="mt-auto pt-4 border-t border-gray-800">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1 text-sm">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <span className="text-gray-300">{jobType}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <IndianRupee className="w-4 h-4 text-red-400" />
            <span className="text-gray-300">{formattedSalary}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-blue-400">Positions:</span>
            <span className="text-gray-300">{position}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-red-400">Exp:</span>
            <span className="text-gray-300">{experience}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestJobCards;
