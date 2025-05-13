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
import { Mail, Lock, Briefcase, GraduationCap } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
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
    if (!formData.email || !formData.password || !formData.role) {
      toast.error('Please fill all fields');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password should be at least 6 characters long');
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
        `${USER_API_END_POINT}/login`,
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const { user, token } = response.data;
        dispatch(authSuccess({ user, token }));
        toast.success('Login successful');
        navigate('/');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.';

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
                Welcome{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500">
                  Back
                </span>
              </h1>
              <p className="text-sm sm:text-base text-gray-400">
                Login to access your personalized dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label className="text-gray-300 flex items-center gap-2 text-sm sm:text-base">
                  <Mail className="h-4 w-4 text-blue-400" />
                  Email Address
                </Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-gray-900 border-2 border-gray-800 text-white placeholder-gray-500 focus:border-blue-500 h-12 text-sm sm:text-base"
                  autoComplete="email"
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
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-gray-900 border-2 border-gray-800 text-white placeholder-gray-500 focus:border-blue-500 h-12 text-sm sm:text-base pr-10"
                    autoComplete="current-password"
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
                <Label className="block text-gray-300 text-sm sm:text-base">
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
                    Logging in...
                  </div>
                ) : (
                  'Login to Your Account'
                )}
              </Button>

              <div className="text-sm text-center text-gray-400 mt-3 sm:mt-4">
                Don't have an account?{' '}
                <Link
                  to="/signUp"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Sign up here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
