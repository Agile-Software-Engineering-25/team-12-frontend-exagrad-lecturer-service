import { combineReducers } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState } from './index';
import examReducer from '@/stores/slices/examSlice';
import gradeReducer from './slices/gradeSlice';

const appReducer = combineReducers({
  exam: examReducer,
  grade: gradeReducer,
});

const rootReducer = appReducer;

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export { useTypedSelector };
export default rootReducer;
