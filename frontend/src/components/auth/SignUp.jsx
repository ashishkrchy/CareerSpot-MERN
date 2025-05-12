import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authSuccess, requestFailure } from '@/store/authSlice';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Button } from '../ui/button';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/backendApiEndpoint';
import { toast } from 'react-hot-toast';
import {
  Mail,
  User,
  Phone,
  Lock,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const validateForm = () => {
    const { fullname, email, phoneNumber, password, role } = formData;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      toast.error('Please fill all fields');
      return false;
    }

    if (!/^[a-zA-Z ]{2,30}$/.test(fullname)) {
      toast.error('Please enter a valid full name (2-30 characters)');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (!/^[0-9]{10,15}$/.test(phoneNumber)) {
      toast.error('Please enter a valid phone number (10-15 digits)');
      return false;
    }

    if (password.length < 8) {
      toast.error('Password should be at least 8 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/signUp`,
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const { user, token } = response.data;
        dispatch(authSuccess({ user, token }));
        toast.success('Account created successfully!');
        navigate('/login');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Signup failed. Please try again.';

      dispatch(requestFailure(errorMessage));
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const user = useSelector((store) => store.auth.user);
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Adjusted width and padding for mobile */}
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl my-8 sm:my-10">
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-xl p-4 sm:p-6 md:p-8 shadow-xl shadow-blue-500/10">
            <div className="text-center mb-6 sm:mb-8">
              {/* Responsive font sizes */}
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Create Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500">
                  Account
                </span>
              </h1>
              <p className="text-sm sm:text-base text-gray-400">
                Join thousands of professionals finding their dream jobs
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label className="text-gray-300 flex items-center gap-2 text-sm sm:text-base">
                  <User className="h-4 w-4 text-blue-400" />
                  Full Name
                </Label>
                <Input
                  type="text"
                  name="fullname"
                  placeholder="John Doe"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="bg-gray-900 border-2 border-gray-800 text-white placeholder-gray-500 focus:border-blue-500 h-12 text-sm sm:text-base"
                  autoComplete="name"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-gray-300 flex items-center gap-2 text-sm sm:text-base">
                  <Mail className="h-4 w-4 text-blue-400" />
                  Email Address
                </Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-gray-900 border-2 border-gray-800 text-white placeholder-gray-500 focus:border-blue-500 h-12 text-sm sm:text-base"
                  autoComplete="email"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label className="text-gray-300 flex items-center gap-2 text-sm sm:text-base">
                  <Phone className="h-4 w-4 text-blue-400" />
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  name="phoneNumber"
                  placeholder="+91 9876543210"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="bg-gray-900 border-2 border-gray-800 text-white placeholder-gray-500 focus:border-blue-500 h-12 text-sm sm:text-base"
                  autoComplete="tel"
                />
              </div>

              {/* Password */}
              <div className="space-y-2 relative">
                <Label className="text-gray-300 flex items-center gap-2 text-sm sm:text-base">
                  <Lock className="h-4 w-4 text-blue-400" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-gray-900 border-2 border-gray-800 text-white placeholder-gray-500 focus:border-blue-500 h-12 text-sm sm:text-base pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 sm:h-5 w-4 sm:w-5" />
                    ) : (
                      <Eye className="h-4 sm:h-5 w-4 sm:w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="block text_gray-300 text-sm sm:text-base">
                  Select Your Role
                </Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={handleRoleChange}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                >
                  <div className="flex items-center">
                    <RadioGroupItem
                      value="student"
                      id="student"
                      className="peer hidden"
                    />
                    <Label
                      htmlFor="student"
                      className={`flex flex-col items-center justify-center w-full p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.role === 'student'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-800 hover:border-blue-400'
                      }`}
                    >
                      <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 mb-2 text-blue-400" />
                      <span className="text-sm font-medium text-blue-300">
                        Student
                      </span>
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem
                      value="recruiter"
                      id="recruiter"
                      className="peer hidden"
                    />
                    <Label
                      htmlFor="recruiter"
                      className={`flex flex-col items-center justify-center w-full p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.role === 'recruiter'
                          ? 'border-red-500 bg-red-500/10'
                          : 'border-gray-800 hover:border-red-400'
                      }`}
                    >
                      <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 mb-2 text-red-400" />
                      <span className="text-sm font-medium text-red-400">
                        Recruiter
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white py-3 sm:py-4 text-sm sm:text-base shadow-lg transition-all duration-300 cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating account...
                  </div>
                ) : (
                  'Sign Up Now'
                )}
              </Button>

              <div className="text-sm text-center text-gray-400 mt-3 sm:mt-4">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Login here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
