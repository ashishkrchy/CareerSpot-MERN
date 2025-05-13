/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen, Eye } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { USER_API_END_POINT } from '@/utils/backendApiEndpoint';
import UpdateProfile from './UpdateProfile';
import AppliedJobTable from './AppliedJobTable';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/store/authSlice';
import { Skeleton } from './ui/skeleton';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    bio: '',
    skills: [],
    profilePicture: '',
    resume: '',
    resumeOriginalName: '',
  });
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${USER_API_END_POINT}/get-user-profile`,
        { withCredentials: true }
      );
      const user = response.data.user;
      if (user) dispatch(setUser(user));

      setUserData({
        fullname: user.fullname || 'User Name',
        email: user.email || 'user@example.com',
        phoneNumber: user.phoneNumber || '+91-0000000000',
        bio: user.profile?.bio || '',
        skills: user.profile?.skills || [],
        profilePicture: user.profile?.profilePicture || '',
        resume: user.profile?.resume || '',
        resumeOriginalName: user.profile?.resumeOriginalName || 'resume.pdf',
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    fetchUserData();
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto my-5 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32 sm:h-6 sm:w-48" />
              <Skeleton className="h-4 w-24 sm:h-4 sm:w-32" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 my-4">
        <div className="bg-gradient-to-br from-gray-900 to-black border border-red-600 rounded-xl p-4 sm:p-6 md:p-8 shadow-lg shadow-red-500/10">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 flex-wrap">
            <div className="flex flex-col xs:flex-row items-center xs:items-start gap-4 flex-wrap w-full sm:w-auto mx-auto">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-2 border-blue-600 shadow-lg shadow-blue-500/30 ">
                <AvatarImage src={userData.profilePicture} />
                <AvatarFallback className="bg-gray-800 text-white">
                  {userData.fullname.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="text-center xs:text-left max-w-full">
                <h1 className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
                  {userData.fullname}
                </h1>
                <p className="text-sm text-gray-400">{user?.role || 'User'}</p>
              </div>
            </div>

            <Button
              onClick={openModal}
              variant="outline"
              className="w-full sm:w-auto mt-2 sm:mt-0 bg-transparent border-2 border-blue-600 text-white hover:bg-blue-600 px-3 py-2 text-sm rounded-lg flex items-center justify-center gap-2"
            >
              <Pen className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>

          <div className="mt-5 w-full rounded-lg border border-gray-800 bg-gray-900/50 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Contact</h2>
            <div className="space-y-4 text-sm text-gray-300">
              <p className="flex flex-wrap items-center justify-start gap-2 break-all">
                <Mail className="w-5 h-5 text-blue-500" />
                <span className="text-center sm:text-left">
                  {userData.email}
                </span>
              </p>
              <p className="flex flex-wrap items-center justify-start  gap-2 break-words">
                <Contact className="w-5 h-5 text-blue-500" />
                <span className="text-center sm:text-left">
                  {userData.phoneNumber}
                </span>
              </p>
            </div>
          </div>

          {/* Bio */}
          {userData.bio && (
            <div className="mt-5 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
              <h2 className="text-md font-bold mb-1 text-white">About</h2>
              <p className="text-sm text-gray-300">{userData.bio}</p>
            </div>
          )}

          {/* Skills */}
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-3 text-white">
              <span className="bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
                Skills
              </span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {userData.skills.length > 0 ? (
                userData.skills.map((skill, idx) => (
                  <Badge
                    key={idx}
                    className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-red-600 py-1 px-3 rounded-full shadow-md"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No skills added</p>
              )}
            </div>
          </div>

          {/* Resume */}
          <div className="mt-6">
            <Label className="text-lg font-bold text-white">
              <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
                Resume
              </span>
            </Label>
            {userData.resume ? (
              <div className="flex gap-4 mt-2">
                <Button
                  onClick={() => window.open(userData.resume, '_blank')}
                  className="bg-gray-800 hover:bg-gray-600 text-white flex items-center gap-2 text-sm px-4 py-2"
                >
                  <Eye className="w-4 h-4" />
                  View Resume
                </Button>
              </div>
            ) : (
              <p className="text-gray-400 text-sm mt-2">No resume uploaded</p>
            )}
          </div>
        </div>

        {/* Applied Jobs */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl mt-6 p-4 sm:p-6 border-2 border-blue-600 shadow-lg shadow-blue-500/10">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
              Applied Jobs
            </span>
          </h2>
          <div className="overflow-x-auto">
            <AppliedJobTable />
          </div>
        </div>
      </div>

      {isModalOpen && <UpdateProfile closeModal={closeModal} />}
    </div>
  );
};

export default Profile;
