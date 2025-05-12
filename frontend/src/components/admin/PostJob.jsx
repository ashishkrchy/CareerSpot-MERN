import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import toast from 'react-hot-toast';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/backendApiEndpoint';
import { Button } from '../ui/button';
import useGetAllCompany from '@/hooks/useGetAllCompany';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const PostJob = () => {
  useGetAllCompany();

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const allRegisteredCompany = useSelector((store) => store.company.companies);

  const companiesNameAndID = allRegisteredCompany.map((company) => ({
    id: company._id,
    name: company.name,
  }));

  const [input, setInput] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    jobType: 'full-time',
    experience: '',
    position: 0,
    company: '',
  });

  const [requirementInput, setRequirementInput] = useState('');

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const addRequirement = () => {
    if (requirementInput.trim() === '') return;
    setInput({
      ...input,
      requirements: input.requirements
        ? `${input.requirements},${requirementInput}`
        : requirementInput,
    });
    setRequirementInput('');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Basic validation
    if (
      !input.title ||
      !input.description ||
      !input.salary ||
      !input.location
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    setInput((prev) => ({
      ...prev,
      jobType: prev.jobType.toLowerCase(),
    }));

    try {
      const response = await axios.post(`${JOB_API_END_POINT}/create`, input, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success('Job posted successfully!');
        navigate('/admin/jobs');
        // Reset form
        setInput({
          title: '',
          description: '',
          requirements: '',
          salary: '',
          location: '',
          jobType: 'Full-time',
          experience: '',
          position: '',
          company: '',
        });
      } else {
        toast.error(response.data.message || 'Failed to post job');
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          'An error occurred while posting the job'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-red-500">
          <div className="bg-blue-600 py-4 px-6">
            <h1 className="text-2xl font-bold text-white">Post a New Job</h1>
          </div>

          <form onSubmit={submitHandler} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-2">
                <Label className="text-black font-medium">Job Title *</Label>
                <Input
                  type="text"
                  name="title"
                  value={input.title}
                  onChange={changeEventHandler}
                  className="focus-visible:ring-blue-500 border-black focus:border-blue-500"
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label className="text-black font-medium">Location *</Label>
                <Input
                  type="text"
                  name="location"
                  value={input.location}
                  onChange={changeEventHandler}
                  className="focus-visible:ring-blue-500 border-black focus:border-blue-500"
                  required
                />
              </div>

              {/* Salary */}
              <div className="space-y-2">
                <Label className="text-black font-medium">Salary *</Label>
                <Input
                  type="text"
                  name="salary"
                  value={input.salary}
                  onChange={changeEventHandler}
                  className="focus-visible:ring-blue-500 border-black focus:border-blue-500"
                  required
                />
              </div>

              {/* Job Type */}
              <div className="space-y-2">
                <Label className="text-black font-medium">Job Type *</Label>
                <select
                  name="jobType"
                  value={input.jobType}
                  onChange={changeEventHandler}
                  className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <Label className="text-black font-medium">
                  Experience Level
                </Label>
                <Input
                  type="text"
                  name="experience"
                  value={input.experience}
                  onChange={changeEventHandler}
                  className="focus-visible:ring-blue-500 border-black focus:border-blue-500"
                  placeholder="e.g. 2-5 years"
                />
              </div>

              {/* Position */}
              <div className="space-y-2">
                <Label className="text-black font-medium">Position</Label>
                <Input
                  type="number"
                  name="position"
                  value={input.position}
                  onChange={changeEventHandler}
                  className="focus-visible:ring-blue-500 border-black focus:border-blue-500"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-black font-medium">
                Job Description *
              </Label>
              <textarea
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                rows={5}
                className="w-full border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <Label className="text-black font-medium">Requirements</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  className="focus-visible:ring-blue-500 border-black focus:border-blue-500"
                  placeholder="Add a requirement"
                />
                <Button
                  type="button"
                  onClick={addRequirement}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Add
                </Button>
              </div>
              {input.requirements && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Current requirements (comma separated):
                  </p>
                  <p className="text-sm text-blue-600">{input.requirements}</p>
                </div>
              )}
            </div>

            {/* Company ID */}

            <div className="space-y-2">
              <Label className="text-black font-medium">Company *</Label>
              <select
                name="company"
                value={input.company}
                onChange={changeEventHandler}
                className="w-full border border-black rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-200 cursor-pointer"
                required
              >
                <option value="" disabled>
                  -- Select a company --
                </option>
                {companiesNameAndID.map((company, i) => (
                  <option key={i} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4">
              {companiesNameAndID.length === 0 ? (
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 font-medium text-center">
                      You need to register at least one company before posting a
                      job.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      navigate('/admin/companies/create', {
                        state: { returnTo: '/admin/post-job' },
                      });
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors shadow-md cursor-pointer"
                  >
                    Register Company
                  </Button>
                </div>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors shadow-md cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    'Post Job'
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
