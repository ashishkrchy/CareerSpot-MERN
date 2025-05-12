/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ProtectedRoutes = ({ children }) => {
  const user = useSelector((store) => store.auth.user);
  const navigate = useDispatch();

  useEffect(() => {
    if (user === null || user.role !== 'recruiter') {
      navigate('/');
    }
  }, []);

  return <>{children}</>;
};

export default ProtectedRoutes;
