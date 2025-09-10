import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SliceState } from '..';
import type { Submission } from '@custom-types/backendTypes';

const submissionSlice = createSlice({
  name: 'submissionSlice',
  initialState: {
    data: {},
    state: 'idle',
    error: null,
  } as SliceState<Submission>,
  reducers: {
    setSubmission: (state, action: PayloadAction<Submission>) => {
      state.data = action.payload;
    },
  },
});

const { setSubmission } = submissionSlice.actions;

export { setSubmission };
export default submissionSlice.reducer;
