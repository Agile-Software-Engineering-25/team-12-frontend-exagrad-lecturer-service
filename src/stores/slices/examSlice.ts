import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SliceState } from '..';
import type { Exam } from '@custom-types/backendTypes';

const examSlice = createSlice({
  name: 'examSlice',
  initialState: {
    data: [],
    state: 'idle',
    error: null,
  } as SliceState<Exam[]>,
  reducers: {
    setExams: (state, action: PayloadAction<Exam[]>) => {
      state.data = action.payload;
    },
  },
});

const { setExams } = examSlice.actions;

export { setExams };
export default examSlice.reducer;
