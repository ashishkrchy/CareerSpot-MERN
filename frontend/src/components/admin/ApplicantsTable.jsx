/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal, Check, X, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useSelector } from 'react-redux';

import { Skeleton } from '../ui/skeleton';
import toast from 'react-hot-toast';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/backendApiEndpoint';

const ApplicantsTable = ({ loading, allApplicants, refetch }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800">Accepted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
    }
  };

  const statusHandler = async (applicationId, status) => {
    try {
      const response = await axios.put(
        `${APPLICATION_API_END_POINT}/status/${applicationId}/update`,
        { status },
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        refetch();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full mb-2" />
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-blue-600">
        <TableRow>
          <TableHead className="text-white">Applicant</TableHead>
          <TableHead className="text-white">Contact</TableHead>
          <TableHead className="text-white">Resume</TableHead>
          <TableHead className="text-white">Status</TableHead>
          <TableHead className="text-white">Applied</TableHead>
          <TableHead className="text-right text-white">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allApplicants.length > 0 ? (
          allApplicants.map((data) => (
            <TableRow key={data._id} className="hover:bg-gray-50">
              <TableCell>
                <div className="font-medium">{data.applicant.fullname}</div>
                <div className="text-sm text-gray-500">
                  {data.applicant.email}
                </div>
              </TableCell>
              <TableCell>+91 {data.applicant.phoneNumber}</TableCell>
              <TableCell>
                <a
                  href={data.applicant.profile.resume}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.applicant.profile.resumeOriginalName || (
                    <span className="text-gray-400">Not uploaded yet</span>
                  )}
                </a>
              </TableCell>
              <TableCell>{getStatusBadge(data.status)}</TableCell>
              <TableCell>
                {new Date(data.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
              <TableCell className="text-right">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-2 space-y-1 bg-white border-none hover:shadow-md">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-green-600 hover:bg-green-50 cursor-pointer"
                      value="Accept"
                      onClick={(e) => {
                        statusHandler(data._id, e.target.value);
                      }}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Accept
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:bg-red-50 cursor-pointer"
                      value="Reject"
                      onClick={(e) => {
                        statusHandler(data._id, e.target.value);
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-blue-600 hover:bg-blue-50 cursor-pointer"
                      value="Pending"
                      onClick={(e) => {
                        statusHandler(data._id, e.target.value);
                      }}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Pending
                    </Button>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={6}
              className="h-24 text-center text-gray-500 py-8"
            >
              <div className="flex flex-col items-center">
                <X className="h-8 w-8 text-red-500 mb-2" />
                <p>No applicants found</p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ApplicantsTable;
