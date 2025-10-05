import { combineReducers } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useSelector } from 'react-redux';
import type { RootState } from './index';
import examReducer from '@/stores/slices/examSlice';
import feedbackReducer from './slices/feedbackSlice';
import submissionReducer from './slices/submissionSlice';

const appReducer = combineReducers({
  exam: examReducer,
  feedback: feedbackReducer,
  submission: submissionReducer,
});

const rootReducer = appReducer;

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export { useTypedSelector };
export default rootReducer;
