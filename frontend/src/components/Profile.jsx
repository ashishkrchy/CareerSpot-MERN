/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen, Download, Eye, ArrowLeft } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { USER_API_END_POINT } from '@/utils/backendApiEndpoint';
import UpdateProfile from './UpdateProfile';
import AppliedJobTable from './AppliedJobTable';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/store/authSlice';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from './ui/skeleton';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      if (user) {
        dispatch(setUser(user));
      }

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
        <div className="max-w-7xl mx-auto my-5 p-8">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto pt-4 px-4 sm:px-6 lg:px-8">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="text-blue-400 hover:text-red-400 flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="max-w-7xl mx-auto bg-gradient-to-br from-gray-900 to-black border-2 border-red-600 rounded-2xl my-5 p-8 shadow-lg shadow-red-500/10">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-24 h-24 border-2 border-blue-600 shadow-lg shadow-blue-500/30">
              <AvatarImage src={userData.profilePicture} />
              <AvatarFallback className="bg-gray-800 text-white">
                {userData.fullname.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
                {userData.fullname}
              </h1>
              <p className="text-sm text-gray-400">
                {user?.role || 'Developer'}
              </p>
              <div className="mt-2 space-y-1 text-sm text-gray-300">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" /> {userData.email}
                </p>
                <p className="flex items-center gap-2">
                  <Contact className="w-4 h-4 text-blue-500" />{' '}
                  {userData.phoneNumber}
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={openModal}
            variant="outline"
            className="bg-transparent border-2 border-blue-600 text-white hover:bg-blue-600 hover:border-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
          >
            <Pen className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>

        {/* Bio Section */}
        {userData.bio && (
          <div className="mt-6 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
            <h2 className="text-md font-bold mb-2 text-white">About</h2>
            <p className="text-gray-300">{userData.bio}</p>
          </div>
        )}

        {/* Skills Section */}
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-3 text-white flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
              Skills
            </span>
          </h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {userData.skills.length > 0 ? (
              userData.skills.map((skill, index) => (
                <Badge
                  key={index}
                  className="text-white font-semibold bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 py-1 px-3 rounded-full shadow-md"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-gray-400 text-sm px-1">No skills added</p>
            )}
          </div>

          {/* Resume Section */}
          <div className="mt-6">
            <Label className="text-lg font-bold text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
                Resume
              </span>
            </Label>
            {userData.resume ? (
              <div className="flex gap-4 mt-2">
                <Button
                  onClick={() => window.open(userData.resume, '_blank')}
                  className="bg-gray-800 hover:bg-gray-600 text-white flex items-center gap-2 cursor-pointer"
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
      </div>

      {/* Applied Jobs Section */}
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-gray-900 to-black rounded-2xl mt-8 p-6 border-2 border-blue-600 shadow-lg shadow-blue-500/10">
        <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
          <span className="bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
            Applied Jobs
          </span>
        </h2>
        <AppliedJobTable />
      </div>

      {/* Modal for UpdateProfile */}
      {isModalOpen && <UpdateProfile closeModal={closeModal} />}
    </div>
  );
};

export default Profile;
