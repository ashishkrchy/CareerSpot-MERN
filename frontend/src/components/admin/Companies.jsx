import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import CompanyTable from './CompanyTable';
import { Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useGetAllCompany from '@/hooks/useGetAllCompany';
import { useSelector } from 'react-redux';

const Companies = () => {
  useGetAllCompany();

  const companies = useSelector((store) => store.company.companies);

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header with title, search and button */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Company Management
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                className="w-full pl-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 cursor-pointer mt-4 sm:mt-0"
              onClick={() => navigate('/admin/companies/create')}
            >
              <Plus className="h-4 w-4" />
              New Company
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex gap-3 items-center bg-gray-800 text-white p-3 rounded-lg shadow mb-3 w-full max-w-[600px] sm:max-w-full">
          <h3 className="font-semibold text-sm sm:text-base">
            Total Companies : -
          </h3>
          <p className="text-xl font-bold">{companies.length}</p>
        </div>

        {/* Company Table */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <CompanyTable searchTerm={searchTerm} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companies;
