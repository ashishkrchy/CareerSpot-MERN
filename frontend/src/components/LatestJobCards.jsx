import React from 'react';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Clock,
  MapPin,
  Briefcase,
  Award,
  Zap,
  IndianRupee,
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <Link
      to={`/description/${job?._id || 'default'}`}
      className="block p-4 rounded-lg bg-gray-900 border border-gray-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 h-full"
      aria-label={`View details for ${jobTitle} at ${companyName}`}
    >
      {/* Company Info */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="w-10 h-10 border-2 border-blue-500/30 group-hover:border-blue-500 transition-all">
          <AvatarImage
            src={job.company?.logo || 'https://via.placeholder.com/100'}
            className="object-contain bg-white p-1"
            alt={`${companyName} logo`}
          />
          <AvatarFallback className="bg-gray-800 text-white text-sm">
            {companyName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h2 className="font-medium text-sm text-white group-hover:text-blue-400 transition-colors truncate">
            {companyName}
          </h2>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{companyLocation}</span>
          </div>
        </div>
      </div>

      {/* Job Info */}
      <div className="mb-3">
        <h1 className="font-bold text-base text-white mb-1 group-hover:text-blue-400 transition-colors truncate">
          {jobTitle}
        </h1>
        <p className="text-gray-400 text-xs mb-2 line-clamp-2">
          {jobDescription}
        </p>

        {/* Posted Date */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <Clock className="w-3 h-3" />
          <span>Posted: {postedDate}</span>
        </div>

        {/* Requirements */}
        {requirements.length > 0 && (
          <div className="mb-2">
            <h3 className="text-red-400 text-xs font-medium mb-1 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Requirements
            </h3>
            <div className="flex flex-wrap gap-1">
              {requirements.slice(0, 2).map((req, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-blue-400 border-blue-400/30 bg-blue-400/10 hover:bg-blue-400/20 transition-colors py-0.5 px-1.5 text-xs truncate max-w-[120px]"
                >
                  {req}
                </Badge>
              ))}
              {requirements.length > 2 && (
                <Badge className="text-gray-400 bg-gray-800 text-xs">
                  +{requirements.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-2">
            <h3 className="text-blue-400 text-xs font-medium mb-1 flex items-center gap-1">
              <Award className="w-3 h-3" /> Skills
            </h3>
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 2).map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-red-400 border-red-400/30 bg-red-400/10 hover:bg-red-400/20 transition-colors py-0.5 px-1.5 text-xs truncate max-w-[120px]"
                >
                  {skill}
                </Badge>
              ))}
              {skills.length > 2 && (
                <Badge className="text-gray-400 bg-gray-800 text-xs">
                  +{skills.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Job Details Badges */}
      <div className="pt-2 border-t border-gray-800">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1 text-xs">
            <Briefcase className="w-3 h-3 text-blue-400" />
            <span className="text-gray-300 truncate">{jobType}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <IndianRupee className="w-3 h-3 text-red-400" />
            <span className="text-gray-300 truncate">{formattedSalary}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-blue-400">Pos:</span>
            <span className="text-gray-300">{position}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-red-400">Exp:</span>
            <span className="text-gray-300 truncate">{experience}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LatestJobCards;
