import { createSlice } from '@reduxjs/toolkit';

const jobSlice = createSlice({
  name: 'job',
  initialState: {
    allJobs: [],
    allAdminJobs: [],
    searchedQuery: '',
    jobWishlist: [],
  },
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
    setJobWishlist: (state, action) => {
      if (!action.payload || !action.payload._id) {
        console.error('Invalid job data in payload');
        return false;
      }

      const jobExists = state.jobWishlist.some(
        (job) => job._id === action.payload._id
      );

      if (!jobExists) {
        state.jobWishlist = [...state.jobWishlist, action.payload];
      }

    },
    removeFromWishlist: (state, action) => {
      state.jobWishlist = state.jobWishlist.filter(
        (job) => job._id !== action.payload
      );
    },
  },
});

export const {
  setAllJobs,
  setAllAdminJobs,
  setSearchedQuery,
  setJobWishlist,
  removeFromWishlist,
} = jobSlice.actions;
export default jobSlice.reducer;
