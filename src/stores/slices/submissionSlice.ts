import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { SliceState } from '..';
import type { Submission } from '@custom-types/backendTypes';

const submissionSlice = createSlice({
  name: 'submissionSlice',
  initialState: {
    data: {},
    state: 'idle',
    error: null,
  } as SliceState<Submission[]>,
  reducers: {
    setSubmissions: (state, action: PayloadAction<Submission[]>) => {
      state.data = action.payload;
    },
  },
});

const { setSubmissions } = submissionSlice.actions;

export { setSubmissions };
export default submissionSlice.reducer;
