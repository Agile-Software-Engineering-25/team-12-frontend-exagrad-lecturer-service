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
      const gradeArray = action.payload;
      const gradeMap: FeedbackMap = {};

      for (const grade of gradeArray) {
        const key = `${grade.examUuid}:${grade.studentUuid}`;
        gradeMap[key] = grade;
      }

      state.data = { ...state.data, ...gradeMap };
    },
  },
});

const { setFeedback } = feedbackSlice.actions;

export { setFeedback };
export default feedbackSlice.reducer;
