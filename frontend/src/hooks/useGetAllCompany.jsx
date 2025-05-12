/* eslint-disable react-hooks/exhaustive-deps */
import { setAllCompany } from '@/store/companySlice';
import { COMPANY_API_END_POINT } from '@/utils/backendApiEndpoint';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllCompany = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllCompany = async () => {
      try {
        const response = await axios.get(
          `${COMPANY_API_END_POINT}/get-companies`,
          {
            withCredentials: true,
          }
        );
        
        if (response.data.success) {
          dispatch(setAllCompany(response.data.companies));
        }
      } catch (error) {
        console.error('Error fetching companies:', error.message || error);
      }
    };
    fetchAllCompany();
  }, []);
};

export default useGetAllCompany;
