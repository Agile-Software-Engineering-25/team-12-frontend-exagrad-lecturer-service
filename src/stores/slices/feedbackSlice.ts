import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { SliceState } from '..';
import type { Feedback } from '@custom-types/backendTypes';

type FeedbackMap = { [uuid: string]: Feedback };

const feedbackSlice = createSlice({
  name: 'feedbackSlice',
  initialState: {
    data: {},
    state: 'idle',
    error: null,
  } as SliceState<FeedbackMap>,
  reducers: {
    setFeedback: (state, action: PayloadAction<Feedback[]>) => {
      const feedbackArray = action.payload;
      const feedbackMap: FeedbackMap = {};

      for (const feedback of feedbackArray) {
        const key = `${feedback.examUuid}:${feedback.studentUuid}`;
        feedbackMap[key] = feedback;
      }

      state.data = { ...state.data, ...feedbackMap };
    },
  },
});

const { setFeedback } = feedbackSlice.actions;

export { setFeedback };
export default feedbackSlice.reducer;
