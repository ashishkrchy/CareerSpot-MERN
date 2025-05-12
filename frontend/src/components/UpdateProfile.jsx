/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  X,
  Upload,
  User,
  Mail,
  Phone,
  FileText,
  File,
  Check,
} from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/store/authSlice';
import { USER_API_END_POINT } from '@/utils/backendApiEndpoint';
import { Progress } from './ui/progress';

const UpdateProfile = ({ closeModal }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((store) => store.auth.user);

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    bio: '',
    skills: '',
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [resume, setResume] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${USER_API_END_POINT}/get-user-profile`,
          { withCredentials: true }
        );
        const user = response.data.user;
        setFormData({
          fullname: user.fullname,
          email: user.email,
          phoneNumber: user.phoneNumber,
          bio: user.profile?.bio || '',
          skills: user.profile?.skills?.join(', ') || '',
        });
        setProfilePictureUrl(user.profile?.profilePicture);
        setResumeUrl(user.profile?.resume);
      } catch (error) {
        toast.error('Failed to fetch profile data');
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === 'profilePicture' && e.target.files?.[0]) {
      setProfilePicture(e.target.files[0]);
      setProfilePictureUrl(URL.createObjectURL(e.target.files[0]));
    } else if (e.target.name === 'resume' && e.target.files?.[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) form.append(key, value);
      });

      if (profilePicture) form.append('profilePicture', profilePicture);
      if (resume) form.append('resume', resume);

      const response = await axios.put(
        `${USER_API_END_POINT}/update-profile`,
        form,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      if (response.data.success) {
        dispatch(setUser(response.data.user));
        setSuccess(true);
        toast.success('Profile updated successfully');
        setTimeout(closeModal, 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-gray-900 rounded-xl border-2 border-red-600 shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Gradient header */}
        <div className="h-1 bg-gradient-to-r from-red-600 via-blue-600 to-purple-600"></div>

        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Update Profile</h2>
              <p className="text-gray-400 mt-1">
                Keep your professional information current
              </p>
            </div>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-red-500 p-1 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label icon={<User size={16} />} htmlFor="fullname">
                  Full Name
                </Label>
                <Input
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label icon={<Mail size={16} />} htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label icon={<Phone size={16} />} htmlFor="phoneNumber">
                  Phone
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1 (123) 456-7890"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label icon={<FileText size={16} />} htmlFor="bio">
                  Professional Bio
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe your professional background..."
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="JavaScript, React, Node.js"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-800">
              <div className="space-y-3">
                <Label icon={<User size={16} />}>Profile Picture</Label>
                <div className="flex items-center gap-4">
                  <FileUploadButton
                    name="profilePicture"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  {profilePictureUrl && (
                    <div className="relative">
                      <img
                        src={profilePictureUrl}
                        alt="Profile preview"
                        className="h-12 w-12 rounded-full object-cover border border-blue-500"
                      />
                      {profilePicture && (
                        <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Label icon={<File size={16} />}>Resume (PDF/DOC)</Label>
                <div className="flex items-center gap-4">
                  <FileUploadButton
                    name="resume"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                  />
                  {resume && (
                    <span className="text-sm text-blue-400 flex items-center gap-1">
                      <Check size={16} />
                      {resume.name}
                    </span>
                  )}
                  {resumeUrl && !resume && (
                    <a
                      href={`${resumeUrl}?fl_attachment`}
                      className="text-sm text-blue-400 hover:underline"
                      download
                    >
                      Download current resume
                    </a>
                  )}
                </div>
              </div>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-red-600 text-red-400 hover:bg-red-600/10 cursor-pointer"
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white cursor-pointer"
                loading={loading}
                disabled={loading || success}
              >
                {success ? 'Success!' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Label = ({ children, htmlFor, icon }) => (
  <label
    htmlFor={htmlFor}
    className="flex items-center gap-2 text-sm font-medium text-gray-300"
  >
    {icon}
    <span>{children}</span>
  </label>
);

const FileUploadButton = ({ name, onChange, accept }) => (
  <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 border border-blue-600 text-blue-400 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
    <Upload size={16} />
    <span>Choose File</span>
    <input
      type="file"
      name={name}
      onChange={onChange}
      accept={accept}
      className="hidden"
    />
  </label>
);

export default UpdateProfile;
