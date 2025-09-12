import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SliceState } from '..';
import type { Feedback } from '@custom-types/backendTypes';

type GradeMap = { [uuid: string]: Feedback };

const gradeSlice = createSlice({
  name: 'gradeSlice',
  initialState: {
    data: {},
    state: 'idle',
    error: null,
  } as SliceState<GradeMap>,
  reducers: {
    setGrades: (state, action: PayloadAction<Feedback[]>) => {
      const gradeArray = action.payload;
      const gradeMap: GradeMap = {};

      for (const grade of gradeArray) {
        const key = `${grade.examUuid}:${grade.studentUuid}`;
        gradeMap[key] = grade;
      }

      state.data = { ...state.data, ...gradeMap };
    },
  },
});

const { setGrades } = gradeSlice.actions;

export { setGrades };
export default gradeSlice.reducer;
