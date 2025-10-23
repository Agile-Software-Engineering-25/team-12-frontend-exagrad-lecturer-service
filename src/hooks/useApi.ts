import useAxiosInstance from '@hooks/useAxiosInstance';
import { BACKEND_BASE_URL } from '@/config';
import { useCallback } from 'react';
import type { Exam, Feedback, Submission } from '@custom-types/backendTypes';

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
        return response.data as Submission[];
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

  const updateFeedback = useCallback(
    async (feedback: Feedback) => {
      try {
        axiosInstance.put(`/feedback/${feedback.uuid}`, feedback);
        return true;
      } catch (error) {
        console.error('Error while updating feedback', error);
        return false;
      }
    },
    [axiosInstance]
  );

  const fetchSubmissionsForExam = useCallback(
    async (examUuid: string) => {
      try {
        const response = await axiosInstance.get(
          `/submissions/for-exam/${examUuid}`
        );
        return response.data as Submission[];
      } catch (error) {
        console.error('Error while updating submissions: ', error);
        return false;
      }
    },
    [axiosInstance]
  );

  const submitFeedback = useCallback(
    async (feedbacks: Feedback[]) => {
      try {
        await axiosInstance.post(`/feedback/submit`, feedbacks);
        return true;
      } catch (error) {
        console.error('Error while submitting feedback', error);
        return false;
      }
    },
    [axiosInstance]
  );

  return {
    fetchExams,
    fetchFeedbackForLecturer,
    fetchSubmissionsForLecturer,
    saveFeedback,
    updateFeedback,
    fetchSubmissionsForExam,
    submitFeedback,
  };
};

export default useApi;
