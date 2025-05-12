/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import ApplicantsTable from './ApplicantsTable';
import { APPLICATION_API_END_POINT } from '@/utils/backendApiEndpoint';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAllApplicants } from '@/store/applicationSlice';

const Applicants = () => {
  const jobId = useParams().id;

  const dispatch = useDispatch();
  const [applicants, setApplicants] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAllApplicants = async () => {
    try {
      setLoading(true);
      const applicantsRes = await axios.get(
        `${APPLICATION_API_END_POINT}/${jobId}/applicants`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (applicantsRes.data.success) {
        setApplicants(applicantsRes.data.applicants);
        dispatch(setAllApplicants(applicantsRes.data.applicants));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllApplicants();
  }, [jobId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <p className="text-gray-600">
              {loading
                ? 'Loading...'
                : `Total applicants : (${applicants.length || 0}) `}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          <ApplicantsTable
            loading={loading}
            allApplicants={applicants}
            refetch={fetchAllApplicants}
          />
        </div>
      </div>
    </div>
  );
};

export default Applicants;
