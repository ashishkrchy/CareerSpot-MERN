import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { COMPANY_API_END_POINT } from '@/utils/backendApiEndpoint';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '@/store/companySlice';

const CreateCompany = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateCompanyName = () => {
    if (!companyName.trim()) {
      setError('Company name is required');
      return false;
    }
    if (companyName.length < 3) {
      setError('Company name must be at least 3 characters');
      return false;
    }
    setError('');
    return true;
  };

  const registerCompany = async () => {
    if (!validateCompanyName()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { name: companyName },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        dispatch(setSingleCompany(response.data.company));
        toast.success(response.data.message);
        navigate(`/admin/companies/${response.data.company.id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create company');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
          <div className="bg-blue-600 px-6 py-4 border-b border-blue-700">
            <h1 className="text-xl font-bold text-white">Create New Company</h1>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Your Company Name
              </h2>
              <p className="text-gray-600 mt-1">
                What would you like to name your company? You can change this
                later.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">
                Company Name *
              </Label>
              <Input
                type="text"
                className={`border ${
                  error ? 'border-red-500' : 'border-gray-300'
                } focus:border-blue-500 focus:ring-blue-500`}
                placeholder="e.g., JobHunt, Microsoft"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  if (error) setError('');
                }}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                variant="outline"
                className="text-gray-700 border-gray-300 hover:bg-gray-50"
                onClick={() => navigate('/admin/companies')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={registerCompany}
                disabled={isLoading || !companyName.trim()}
              >
                {isLoading ? 'Creating...' : 'Create Company'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCompany;
