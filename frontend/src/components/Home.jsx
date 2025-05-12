/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';

import Footer from './shared/Footer';
import { Outlet, useNavigate } from 'react-router-dom';
import HeroSection from './HeroSection';
import CategoryCarousel from './CategoryCarousel';
import LatestJobs from './LatestJobs';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { useSelector } from 'react-redux';

const Home = () => {
  useGetAllJobs();

  const user = useSelector((store) => store.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate('/admin/companies');
    } else {
      navigate('/');
    }
  }, []);

  return (
    <div className="bg-black">
      <Navbar />

      <HeroSection />

      <CategoryCarousel />

      <LatestJobs />

      <Footer />
    </div>
  );
};

export default Home;
