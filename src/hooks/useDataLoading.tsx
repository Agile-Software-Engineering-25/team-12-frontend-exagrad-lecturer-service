import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import useApi from '@/hooks/useApi';
import {
  setFeedback,
  setFeedbackLoading,
  setFeedbackFailed,
} from '@/stores/slices/feedbackSlice';
import {
  setExams,
  setExamsLoading,
  setExamsFailed,
} from '@/stores/slices/examSlice';
import {
  setSubmissions,
  setSubmissionsLoading,
  setSubmissionsFailed,
} from '@stores/slices/submissionSlice.ts';

const useDataLoading = () => {
  const dispatch = useDispatch();
  const { fetchExams, fetchSubmissionsForLecturer, fetchFeedbackForLecturer } =
    useApi();

  const loadExams = useCallback(
    async (lecturerUuid: string) => {
      try {
        dispatch(setExamsLoading());
        const exams = await fetchExams(lecturerUuid);
        if (exams) {
          dispatch(setExams(exams));
        }
      } catch (error) {
        dispatch(setExamsFailed(String(error)));
      }
    },
    [fetchExams, dispatch]
  );

  const loadFeedback = useCallback(
    async (lecturerUuid: string) => {
      try {
        dispatch(setFeedbackLoading());
        const results = await fetchFeedbackForLecturer(lecturerUuid);
        dispatch(setFeedback(results || []));
      } catch (error) {
        dispatch(setFeedbackFailed(String(error)));
      }
    },
    [dispatch, fetchFeedbackForLecturer]
  );

  const loadSubmissions = useCallback(
    async (lecturerUuid: string) => {
      try {
        dispatch(setSubmissionsLoading());
        const results = await fetchSubmissionsForLecturer(lecturerUuid);
        dispatch(setSubmissions(results || []));
      } catch (error) {
        dispatch(setSubmissionsFailed(String(error)));
      }
    },
    [dispatch, fetchSubmissionsForLecturer]
  );

  return {
    loadExams,
    loadFeedback,
    loadSubmissions,
  };
};

export default useDataLoading;
