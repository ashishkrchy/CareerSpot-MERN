/* eslint-disable react-hooks/exhaustive-deps */
import { setAllJobs } from '@/store/jobSlice';
import { JOB_API_END_POINT } from '@/utils/backendApiEndpoint';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const response = await axios.get(`${JOB_API_END_POINT}/get`, {
          withCredentials: true,
        });

        if (response.data.success) {
          dispatch(setAllJobs(response.data.jobs));
        }
      } catch (err) {
        console.error('Error fetching Jobs', err);
      }
    };
    fetchAllJobs();
  }, []);
};

export default useGetAllJobs;
