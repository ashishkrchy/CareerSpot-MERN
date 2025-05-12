/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/backendApiEndpoint';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '@/store/companySlice';

const CompanySetUp = () => {
  const companyId = useParams().id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [input, setInput] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
    file: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState('');

  // Fetch company data when component mounts
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(
          `${COMPANY_API_END_POINT}/get-company/${companyId}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          const { name, description, website, location, logo } =
            response.data.company;
          setInput({
            name,
            description,
            website,
            location,
            file: null,
          });
          if (logo) {
            setPreview(logo);
          }
        }
      } catch (err) {
        toast.error('Failed to load company data');
      }
    };

    fetchCompanyData();
  }, [companyId]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!input.name.trim()) {
      toast.error('Company name is required');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', input.name);
    formData.append('description', input.description);
    formData.append('website', input.website);
    formData.append('location', input.location);

    if (input.file) {
      formData.append('logo', input.file);
    }

    try {
      const response = await axios.put(
        `${COMPANY_API_END_POINT}/update-company/${companyId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setSingleCompany(response.data.company));
        navigate('/admin/companies');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update company');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
          <div className="bg-blue-600 px-6 py-4 border-b border-blue-700">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate(-1)}
                className="text-white bg-blue-700 hover:bg-blue-800"
                size="icon"
                variant="ghost"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-white">Company Setup</h1>
            </div>
          </div>

          <form onSubmit={submitHandler} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">
                  Company Name *
                </Label>
                <Input
                  type="text"
                  name="name"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., JobHunt, Microsoft"
                  value={input.name}
                  onChange={changeEventHandler}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Website</Label>
                <Input
                  type="url"
                  name="website"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://example.com"
                  value={input.website}
                  onChange={changeEventHandler}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-gray-700 font-medium">Description</Label>
                <Input
                  type="text"
                  name="description"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Brief description about your company"
                  value={input.description}
                  onChange={changeEventHandler}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Location</Label>
                <Input
                  type="text"
                  name="location"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="City, Country"
                  value={input.location}
                  onChange={changeEventHandler}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">
                  Company Logo
                </Label>
                <div className="flex items-center space-x-4">
                  {preview && (
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500">
                      <img
                        src={preview}
                        alt="Company logo preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      type="file"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      accept="image/*"
                      onChange={changeFileHandler}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md shadow-md transition duration-200"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Company'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanySetUp;
