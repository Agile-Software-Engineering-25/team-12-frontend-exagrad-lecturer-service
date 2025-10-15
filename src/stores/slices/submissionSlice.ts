import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { SliceState } from '..';
import type { Submission } from '@custom-types/backendTypes';

type SubmissionMap = { [key: string]: Submission };

const submissionSlice = createSlice({
  name: 'submissionSlice',
  initialState: {
    data: {},
    state: 'idle',
    error: null,
  } as SliceState<SubmissionMap>,
  reducers: {
    setSubmissions: (state, action: PayloadAction<Submission[]>) => {
      const submissions = action.payload;
      const submissionMap: SubmissionMap = {};

      for (const submission of submissions) {
        const key = `${submission.examUuid}:${submission.studentUuid}`;

        if (state.data[key]) {
          submissionMap[key] = { ...state.data[key], ...submission };
        } else {
          submissionMap[key] = submission;
        }
      }

      state.data = { ...state.data, ...submissionMap };
    },
  },
});

const { setSubmissions } = submissionSlice.actions;

export { setSubmissions };
export default submissionSlice.reducer;
