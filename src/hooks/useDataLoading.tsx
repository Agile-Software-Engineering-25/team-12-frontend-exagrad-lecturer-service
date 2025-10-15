import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import useApi from '@/hooks/useApi';
import { setFeedback } from '@/stores/slices/feedbackSlice';
import { setExams } from '@/stores/slices/examSlice';
import { setSubmissions } from '@stores/slices/submissionSlice.ts';

const useDataLoading = () => {
  const dispatch = useDispatch();
  const { fetchExams, fetchSubmissionsForLecturer, fetchFeedbackForLecturer } =
    useApi();

  const loadExams = useCallback(
    async (lecturerUuid: string) => {
      const exams = await fetchExams(lecturerUuid);
      if (exams) {
        dispatch(setExams(exams));
      }
    },
    [fetchExams, dispatch]
  );

  const loadFeedback = useCallback(
    async (lecturerUuid: string) => {
      const results = await fetchFeedbackForLecturer(lecturerUuid);
      dispatch(setFeedback(results || []));
    },
    [dispatch, fetchFeedbackForLecturer]
  );

  const loadSubmissions = useCallback(
    async (lecturerUuid: string) => {
      const results = await fetchSubmissionsForLecturer(lecturerUuid);
      dispatch(setSubmissions(results || []));
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
