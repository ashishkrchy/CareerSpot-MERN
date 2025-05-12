import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

import { Edit2, MoreHorizontal, Building2, Trash2, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';

const CompanyTable = ({ searchTerm }) => {
  const navigate = useNavigate();
  const allCompanies = useSelector((store) => store.company.companies);

  const filteredCompanies = allCompanies.filter((company) =>
    company.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full divide-y divide-gray-200">
        <TableCaption className="mt-4 text-gray-500">
          A list of companies registered
        </TableCaption>
        <TableHeader className="bg-blue-600">
          <TableRow>
            <TableHead className="w-[100px] text-white">Logo</TableHead>
            <TableHead className="text-white">Company Name</TableHead>
            <TableHead className="text-white">Registration Date</TableHead>
            <TableHead className="text-right text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <TableRow
                key={company._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell>
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarImage src={company.logo} alt={company.name} />
                    <AvatarFallback className="bg-gray-100">
                      <Building2 className="h-5 w-5 text-gray-500" />
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium text-gray-900">
                  {company.name}
                </TableCell>

                <TableCell className="text-gray-500">
                  {new Date(company.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    className=" text-gray-700 hover:bg-gray-300 cursor-pointer text-xs sm:text-sm"
                    onClick={() => navigate(`/admin/companies/${company._id}`)}
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                {searchTerm
                  ? `No companies found matching "${searchTerm}"`
                  : 'No companies registered yet'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompanyTable;
