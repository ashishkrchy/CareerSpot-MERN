/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { APPLICATION_API_END_POINT } from '@/utils/backendApiEndpoint';
import { Clock, Briefcase, Building2, AlertCircle } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { useNavigate } from 'react-router-dom';

const AppliedJobTable = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setApplications(response.data.applications);
        } else {
          setError(response.data.message || 'No applications found');
        }
      } catch (err) {
        setError('Failed to fetch applied jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: {
        bg: 'bg-yellow-600/20',
        text: 'text-yellow-400',
        border: 'border-yellow-500',
      },
      accepted: {
        bg: 'bg-green-600',
        text: 'text-white',
        border: 'border-white',
      },
      rejected: {
        bg: 'bg-red-600/20',
        text: 'text-red-400',
        border: 'border-red-500',
      },

      default: {
        bg: 'bg-gray-600/20',
        text: 'text-gray-400',
        border: 'border-gray-500',
      },
    };

    const statusConfig = statusMap[status] || statusMap.default;
    return (
      <Badge
        className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border font-medium`}
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="border-2 border-gray-800 rounded-xl overflow-hidden">
      <Table className="border-collapse w-full">
        <TableCaption>Your list of applied jobs</TableCaption>
        <TableHeader className="bg-black">
          <TableRow className="border-b-2 border-gray-800 hover:bg-gray-900/50">
            <TableHead className="py-4 px-6 text-left">
              <div className="flex items-center gap-2 text-blue-400">
                <Clock className="h-4 w-4" />
                <span>Date</span>
              </div>
            </TableHead>
            <TableHead className="py-4 px-6 text-left">
              <div className="flex items-center gap-2 text-blue-400">
                <Briefcase className="h-4 w-4" />
                <span>Job Role</span>
              </div>
            </TableHead>
            <TableHead className="py-4 px-6 text-left">
              <div className="flex items-center gap-2 text-blue-400">
                <Building2 className="h-4 w-4" />
                <span>Company</span>
              </div>
            </TableHead>
            <TableHead className="py-4 px-6 text-left">
              <div className="flex items-center gap-2 text-blue-400">
                <AlertCircle className="h-4 w-4" />
                <span>Status</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-gray-900/50">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <TableRow
                key={i}
                className="border-b border-gray-800 hover:bg-gray-800/50"
              >
                <TableCell colSpan={5}>
                  <div className="flex justify-between items-center p-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : error ? (
            <TableRow className="border-b border-gray-800 hover:bg-gray-800/50">
              <TableCell colSpan={5} className="py-8 text-center">
                <div className="text-red-400 flex flex-col items-center gap-2">
                  <AlertCircle className="h-6 w-6" />
                  <span>{error}</span>
                  <Button
                    variant="outline"
                    className="mt-2 border-blue-500 text-blue-400 hover:bg-blue-500/10"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : applications.length === 0 ? (
            <TableRow className="border-b border-gray-800 hover:bg-gray-800/50">
              <TableCell colSpan={5} className="py-8 text-center">
                <div className="text-gray-400 flex flex-col items-center gap-2">
                  <Briefcase className="h-6 w-6" />
                  <span>You haven't applied to any jobs yet</span>
                  <Button
                    variant="outline"
                    className="mt-2 border-blue-500 text-blue-400 hover:bg-blue-500/10"
                    onClick={() => navigate('/jobs')}
                  >
                    Browse Jobs
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            applications.map((application, index) => (
              <TableRow
                key={index}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
              >
                <TableCell className="py-4 px-6 text-gray-300">
                  {formatDate(application.createdAt)}
                </TableCell>
                <TableCell className="py-4 px-6 text-gray-300 font-medium">
                  {application.job?.title || 'N/A'}
                </TableCell>
                <TableCell className="py-4 px-6 text-gray-300">
                  {application.job?.company?.name || 'N/A'}
                </TableCell>
                <TableCell className="py-4 px-6">
                  {getStatusBadge(application.status)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
