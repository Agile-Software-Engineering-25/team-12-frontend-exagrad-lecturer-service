import useAxiosInstance from '@hooks/useAxiosInstance';
import { BACKEND_BASE_URL } from '@/config';
import { useCallback } from 'react';
import type { Exam, Feedback } from '@custom-types/backendTypes';

const useApi = () => {
  const axiosInstance = useAxiosInstance(BACKEND_BASE_URL);

  const fetchExams = useCallback(
    async (lecturerUuid: string) => {
      try {
        const response = await axiosInstance.get('/exams', {
          params: {
            lecturerUuid: lecturerUuid,
          },
        });
        return response.data as Exam[];
      } catch (error) {
        console.error('Error while getting exams: ', error);
        return false;
      }
    },
    [axiosInstance]
  );

  const fetchFeedbackForSubmission = useCallback(
    async (examUuid: string, studentUuid: string) => {
      try {
        const response = await axiosInstance.get('/feedback', {
          params: {
            examUuid: examUuid,
            studentUuid: studentUuid,
          },
        });
        return response.data as Feedback;
      } catch (error) {
        console.error('Error while getting exam: ', error);
        return false;
      }
    },
    [axiosInstance]
  );

  const fetchFeedbackForLecturer = useCallback(
    async (lecturerUuid: string) => {
      try {
        const response = await axiosInstance.get(
          `/feedback/for-lecturer/${lecturerUuid}`
        );
        return response.data as Feedback[];
      } catch (error) {
        console.error('Error while getting exam: ', error);
        return false;
      }
    },
    [axiosInstance]
  );

  const fetchSubmissionsForLecturer = useCallback(
    async (lecturerUuid: string) => {
      try {
        const response = await axiosInstance.get(
          `/submissions/for-lecturer/${lecturerUuid}`
        );
        return response.data as Feedback[];
      } catch (error) {
        console.error('Error while getting exam: ', error);
        return false;
      }
    },
    [axiosInstance]
  );

  const saveFeedback = useCallback(
    async (feedback: Feedback) => {
      try {
        axiosInstance.post('/feedback', feedback);
        return true;
      } catch (error) {
        console.error('Error while saving feedback', error);
        return false;
      }
    },
    [axiosInstance]
  );

  return {
    fetchExams,
    fetchFeedbackForSubmission,
    fetchFeedbackForLecturer,
    fetchSubmissionsForLecturer,
    saveFeedback,
  };
};

export default useApi;
