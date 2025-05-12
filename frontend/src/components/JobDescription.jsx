import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  APPLICATION_API_END_POINT,
  JOB_API_END_POINT,
} from '@/utils/backendApiEndpoint';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Loader2,
  AlertCircle,
  Briefcase,
  MapPin,
  Clock,
  IndianRupee,
  Calendar,
  Users,
  Building2,
  ChevronDown,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useSelector } from 'react-redux';
import { Skeleton } from './ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const JobDescription = () => {
  const { id: jobId } = useParams();
  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [totalApplicants, setTotalApplicants] = useState(0);

  const navigate = useNavigate();

  const currentUserID = useSelector((state) => state.auth.user?.id);

  const [expandedDescription, setExpandedDescription] = useState(false);

  const fetchJobAndApplication = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const jobRes = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      const fetchedJob = jobRes.data.job;

      setJob(fetchedJob);
      setTotalApplicants(fetchedJob.applicants.length || 0);
      setRequirements(fetchedJob.requirements || []);

      // Check if current user has applied
      const userApplication = fetchedJob.applicants?.find(
        (applicantData) => applicantData.applicant._id === currentUserID
      );

      if (userApplication) {
        setHasApplied(true);
        setApplicationStatus(userApplication.status || 'applied');
      } else {
        setHasApplied(false);
        setApplicationStatus(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch job details.');
    } finally {
      setLoading(false);
    }
  }, [jobId, currentUserID]);

  useEffect(() => {
    fetchJobAndApplication();
  }, [fetchJobAndApplication]);

  const handleApply = async () => {
    try {
      console.log('CurrentUserID: ', currentUserID);
      if (!currentUserID) {
        toast.error('Failed to apply, Login First!', {
          style: {
            background: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
          },
        });
        return;
      }
      setLoading(true);
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      console.log('Response: ', res.data);

      setHasApplied(true);
      setTotalApplicants(res.data.totalApplicants || 0);
      setApplicationStatus(res.data.application?.status || 'applied');
      setShowApplyDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      applied: 'bg-blue-900/30 text-blue-400',
      'under review': 'bg-yellow-900/30 text-yellow-400',
      accepted: 'bg-green-900/30 text-green-400',
      rejected: 'bg-red-900/30 text-red-400',
    };
    const capitalizedStatus = status.replace(/(^\w|\s\w)/g, (m) =>
      m.toUpperCase()
    );
    return (
      <Badge className={`${statusStyles[status]} capitalize`}>
        {capitalizedStatus}
      </Badge>
    );
  };

  if (loading && !job) {
    return (
      <div className="max-w-5xl mx-auto mt-12 p-8">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-10 w-3/4 rounded-lg" />
          <Skeleton className="h-6 w-1/2 rounded-lg" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>

          <Skeleton className="h-40 rounded-lg mt-6" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button
            className="mt-4"
            onClick={fetchJobAndApplication}
            variant="outline"
          >
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center mt-10 text-gray-300">
        <AlertCircle className="h-10 w-10 mx-auto text-gray-500 mb-4" />
        <h3 className="text-xl font-medium">Job not found</h3>
        <p className="mt-2">
          The job you're looking for doesn't exist or may have been removed.
        </p>
      </div>
    );
  }

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
          className={`text-white font-medium ${
            highlight ? 'text-red-400' : ''
          }`}
        >
          {}
          {label === 'Salary'
            ? value.includes('L')
              ? value
              : `${value} LPA`
            : value}
        </p>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-screen min-h-screen mx-auto bg-black/100  shadow-2xl border-2 border-gray-800">
      {/* Back Button */}
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="mb-4 text-blue-400 hover:text-red-400 flex items-center gap-1 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Button>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b-2 border-gray-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
              {job.title}
            </h1>
            {hasApplied && applicationStatus && (
              <div className="mt-1">{getStatusBadge(applicationStatus)}</div>
            )}
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Avatar className="h-10 w-10 border-2 border-blue-500/50">
              <AvatarImage src={job.company?.logo} />
              <AvatarFallback className="bg-black border border-gray-800">
                <Building2 className="h-5 w-5 text-blue-500" />
              </AvatarFallback>
            </Avatar>
            <p className="text-gray-400 font-medium">
              {job.company?.name || 'Unknown Company'}
            </p>
          </div>
        </div>
        <div>
          {hasApplied ? (
            <Button
              disabled
              className="bg-gray-900 text-gray-300 border-2 border-gray-800 hover:bg-gray-800 px-6 py-5"
              variant="outline"
            >
              {applicationStatus === 'applied'
                ? 'Application Submitted'
                : `Status: ${applicationStatus.replace(/(^\w|\s\w)/g, (m) =>
                    m.toUpperCase()
                  )}`}
            </Button>
          ) : (
            <Button
              onClick={() => setShowApplyDialog(true)}
              className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-bold px-8 py-5 shadow-lg hover:shadow-red-500/20 transition-all cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Applying...
                </>
              ) : (
                <span className="flex items-center gap-2">
                  Apply Now <ChevronDown className="h-4 w-4" />
                </span>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {renderDetailItem(
          <MapPin />,
          'Location',
          job.location || 'Remote',
          true
        )}
        {renderDetailItem(<Clock />, 'Experience', `${job.experience || '0'} `)}
        {renderDetailItem(
          <IndianRupee />,
          'Salary',
          `${job.salary || 'Negotiable'}`
        )}
        {renderDetailItem(
          <Users />,
          'Applicants',
          totalApplicants || '0',
          true
        )}
        {renderDetailItem(
          <Calendar />,
          'Posted',
          new Date(job.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        )}
        {renderDetailItem(<Briefcase />, 'Job Type', job.jobType, true)}
      </div>

      {/* Description */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b-2 border-gray-800 pb-2">
          <Briefcase className="h-5 w-5 text-red-500" />
          <span className="bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
            Job Description
          </span>
        </h3>
        <div className="bg-gray-900/50 p-6 rounded-lg border-2 border-gray-800">
          <div className="relative">
            <p
              className={`text-gray-300 leading-relaxed whitespace-pre-line ${
                expandedDescription ? '' : 'line-clamp-5'
              }`}
            >
              {job.description || 'No description provided.'}
            </p>
            {job.description &&
              job.description.length > 500 &&
              !expandedDescription && (
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent flex items-end justify-center pb-2">
                  <Button
                    variant="ghost"
                    className="text-blue-400 hover:text-red-400 text-sm font-medium"
                    onClick={() => setExpandedDescription(true)}
                  >
                    Show More <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              )}
          </div>
          {expandedDescription && (
            <Button
              variant="ghost"
              className="text-red-400 hover:text-blue-400 text-sm font-medium mt-2"
              onClick={() => setExpandedDescription(false)}
            >
              Show Less <ChevronDown className="ml-1 h-4 w-4 rotate-180" />
            </Button>
          )}
        </div>
      </div>

      {/* Requirements */}
      {requirements.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b-2 border-gray-800 pb-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            <span className="bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent">
              Requirements
            </span>
          </h3>
          <div className="bg-gray-900/50 p-6 rounded-lg border-2 border-gray-800">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {requirements.sort().map((req, index) => (
                <li key={index} className="flex items-start gap-2 group">
                  <span className="text-red-500 mt-1 group-hover:text-blue-500 transition-colors">
                    ▹
                  </span>
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {req}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Apply Confirmation Dialog */}
      <AlertDialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <AlertDialogContent className="bg-black text-gray-300 border-2 border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-500" />
              <span className="bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
                Confirm Application
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="text-gray-400 mt-4">
                <div className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                  {job.company?.logo && (
                    <Avatar className="h-12 w-12 border-2 border-blue-500/50">
                      <AvatarImage src={job.company.logo} />
                      <AvatarFallback className="bg-black border border-gray-800">
                        <Building2 className="h-6 w-6 text-blue-500" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <p className="text-white font-bold">{job.title}</p>
                    <p className="text-sm text-gray-400">
                      {job.company?.name || 'Unknown Company'}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge className="bg-blue-900/30 text-blue-400 border border-blue-800">
                        {job.jobType}
                      </Badge>
                      <Badge className="bg-red-900/30 text-red-400 border border-red-800">
                        {job.location || 'Remote'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-center">
                  Are you sure you want to apply for this position?
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-black text-gray-300 hover:bg-gray-900 border-2 border-gray-800 hover:border-red-500 px-6">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApply}
              className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-bold px-6"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Applying...
                </>
              ) : (
                'Confirm Application'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default JobDescription;
