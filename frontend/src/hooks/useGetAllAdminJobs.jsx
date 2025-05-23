/* eslint-disable react-hooks/exhaustive-deps */
import { setAllAdminJobs } from '@/store/jobSlice';
import { JOB_API_END_POINT } from '@/utils/backendApiEndpoint';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllAdminJobs = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllAdminJobs = async () => {
      try {
        const response = await axios.get(`${JOB_API_END_POINT}/getAdminJobs`, {
          withCredentials: true,
        });

        if (response.data.success) {
          dispatch(setAllAdminJobs(response.data.jobs));
        }
      } catch (err) {
        console.error('Error fetching Admin Jobs', err);
      }
    };
    fetchAllAdminJobs();
  }, []);
};

export default useGetAllAdminJobs;
