import { createSlice } from '@reduxjs/toolkit';

const reportsSlice = createSlice({
  name: 'reports',
  initialState: {
    list: [],
  },
  reducers: {
    setReports: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { setReports, sortMarks } = reportsSlice.actions;
export default reportsSlice.reducer;
