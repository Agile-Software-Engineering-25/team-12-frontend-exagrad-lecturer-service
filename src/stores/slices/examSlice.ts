import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SliceState } from '..';
import type { Exam } from '@custom-types/backendTypes';

type ExamMap = { [id: string]: Exam };

const examSlice = createSlice({
  name: 'examSlice',
  initialState: {
    data: {},
    state: 'idle',
    error: null,
  } as SliceState<ExamMap>,
  reducers: {
    setExams: (state, action: PayloadAction<Exam[]>) => {
      const examsArray = action.payload;
      const examMap: ExamMap = {};

      for (const exam of examsArray) {
        examMap[exam.uuid] = exam;
      }

      state.data = examMap;
    },
  },
});

const { setExams } = examSlice.actions;

export { setExams };
export default examSlice.reducer;
