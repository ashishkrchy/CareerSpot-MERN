import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

import {
  Edit2,
  MoreHorizontal,
  Building2,
  Trash2,
  Eye,
  Check,
  X,
} from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';

const AdminJobsTable = ({ searchTerm }) => {
  const navigate = useNavigate();

  const allAdminJobs = useSelector((store) => store.job.allAdminJobs);

  const filteredJobs = allAdminJobs.filter((job) =>
    job.title.toLowerCase().startsWith(searchTerm)
  );

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableCaption className="py-4 text-gray-500 bg-gray-50">
          A list of jobs posted
        </TableCaption>
        <TableHeader className="bg-blue-600">
          <TableRow>
            <TableHead className="w-[100px] text-white">Logo</TableHead>
            <TableHead className="text-white">Company</TableHead>
            <TableHead className="text-white">Role</TableHead>
            <TableHead className="text-white">Date</TableHead>
            <TableHead className="text-center text-white">Applicants</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <TableRow key={job._id} className="hover:bg-gray-50">
                <TableCell>
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarImage
                      src={job.company.logo}
                      alt={job.company.name}
                    />
                    <AvatarFallback className="bg-gray-100">
                      <Building2 className="h-5 w-5 text-gray-500" />
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">
                  {job.company.name}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-gray-900">{job.title}</div>
                  <div className="text-sm text-gray-500">{job.jobType}</div>
                </TableCell>

                <TableCell className="text-gray-500">
                  {new Date(job.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </TableCell>
                <TableCell className="text-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-600 hover:bg-blue-200 cursor-pointer"
                    onClick={() =>
                      navigate(`/admin/jobs/${job._id}/applicants`)
                    }
                    title="View total applicants applied"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-gray-500 py-8"
              >
                {searchTerm ? (
                  <div className="flex flex-col items-center">
                    <X className="h-8 w-8 text-red-500 mb-2" />
                    <p>No jobs found matching "{searchTerm}"</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Building2 className="h-8 w-8 text-blue-500 mb-2" />
                    <p>No jobs posted yet</p>
                    <Button
                      className="mt-4 bg-blue-600 hover:bg-blue-700"
                      onClick={() => navigate('/admin/jobs/post')}
                    >
                      Create Your First Job
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
