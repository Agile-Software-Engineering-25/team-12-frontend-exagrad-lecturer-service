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

        if (state.data[key]) {
          feedbackMap[key] = { ...state.data[key], ...feedback };
        } else {
          feedbackMap[key] = feedback;
        }
      }

      state.data = { ...state.data, ...feedbackMap };
      state.state = 'idle';
    },
    setFeedbackLoading: (state) => {
      state.state = 'loading';
    },
    setFeedbackFailed: (state, action: PayloadAction<string>) => {
      state.state = 'failed';
      state.error = action.payload;
    },
    deleteFeedback: (state, action: PayloadAction<Feedback>) => {
      const feedback = action.payload;
      const key = `${feedback.examUuid}:${feedback.studentUuid}`;
      delete state.data[key];
    },
    updateFeedbackSlice: (state, action: PayloadAction<Feedback>) => {
      const updatedFeedback = action.payload;
      const key = `${updatedFeedback.examUuid}:${updatedFeedback.studentUuid}`;

      if (state.data[key]) {
        state.data[key] = {
          ...state.data[key],
          ...updatedFeedback,
        };
      } else {
        state.data[key] = updatedFeedback;
      }
    },
  },
});

const {
  setFeedback,
  deleteFeedback,
  updateFeedbackSlice,
  setFeedbackLoading,
  setFeedbackFailed,
} = feedbackSlice.actions;

export {
  setFeedback,
  deleteFeedback,
  updateFeedbackSlice,
  setFeedbackLoading,
  setFeedbackFailed,
};
export default feedbackSlice.reducer;
