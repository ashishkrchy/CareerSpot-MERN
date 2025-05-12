import React from 'react';

import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router';
import Home from './components/Home';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Profile from './components/Profile';
import Jobs from './components/Jobs';
import Browse from './components/Browse';
import JobDescription from './components/JobDescription';
import UpdateProfile from './components/UpdateProfile';
import Companies from './components/admin/Companies';
import AdminJobs from './components/admin/AdminJobs';
import CreateCompany from './components/admin/CreateCompany';
import CompanySetUp from './components/admin/CompanySetUp';
import PostJob from './components/admin/PostJob';
import Applicants from './components/admin/Applicants.jsx';
import Wishlist from './components/Wishlist';
import ProtectedRoutes from './components/admin/ProtectedRoutes';

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signUp',
    element: <SignUp />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/update-profile',
    element: <UpdateProfile />,
  },
  {
    path: '/browse',
    element: <Browse />,
  },
  {
    path: '/jobs',
    element: <Jobs />,
  },
  {
    path: '/description/:id',
    element: <JobDescription />,
  },
  {
    path: '/wishlist',
    element: <Wishlist />,
  },
  //Admin Routes
  {
    path: '/admin/companies',
    element: (
      <ProtectedRoutes>
        <Companies />
      </ProtectedRoutes>
    ),
  },
  {
    path: '/admin/companies/create',
    element: (
      <ProtectedRoutes>
        <CreateCompany />
      </ProtectedRoutes>
    ),
  },
  {
    path: '/admin/companies/:id',
    element: (
      <ProtectedRoutes>
        <CompanySetUp />
      </ProtectedRoutes>
    ),
  },
  {
    path: '/admin/jobs',
    element: (
      <ProtectedRoutes>
        <AdminJobs />
      </ProtectedRoutes>
    ),
  },
  {
    path: '/admin/jobs/post',
    element: (
      <ProtectedRoutes>
        <PostJob />
      </ProtectedRoutes>
    ),
  },
  {
    path: '/admin/jobs/:id/applicants',
    element: (
      <ProtectedRoutes>
        <Applicants />
      </ProtectedRoutes>
    ),
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
};

export default App;
