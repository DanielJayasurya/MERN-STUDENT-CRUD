import { configureStore } from '@reduxjs/toolkit';
import reportsReducer from './reportSlice';

export const store = configureStore({
  reducer: {
    reports: reportsReducer,
  },
});

