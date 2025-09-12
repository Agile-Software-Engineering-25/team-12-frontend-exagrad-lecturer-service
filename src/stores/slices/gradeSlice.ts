import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SliceState } from '..';
import type { Grade } from '@custom-types/backendTypes';

type GradeMap = { [uuid: string]: Grade };

const gradeSlice = createSlice({
  name: 'gradeSlice',
  initialState: {
    data: {},
    state: 'idle',
    error: null,
  } as SliceState<GradeMap>,
  reducers: {
    setGrade: (state, action: PayloadAction<Grade[]>) => {
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

const { setGrade } = gradeSlice.actions;

export { setGrade };
export default gradeSlice.reducer;
