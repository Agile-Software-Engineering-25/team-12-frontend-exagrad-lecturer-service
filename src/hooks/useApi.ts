import useAxiosInstance from '@hooks/useAxiosInstance';
import { BACKEND_BASE_URL } from '@/config';
import { useCallback } from 'react';
import type {
  Exam,
  Feedback,
  Submission,
  FeedbackRequest,
} from '@custom-types/backendTypes';

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
        console.error('Error while getting submission: ', error);
        return false;
      }
    },
    [axiosInstance]
  );

  const saveFeedback = useCallback(
    async (feedbackData: FeedbackRequest, files: File[]) => {
      const formData = new FormData();
      const feedbackBlob = new Blob([JSON.stringify(feedbackData)], {
        type: 'application/json',
      });
      formData.append('feedbackData', feedbackBlob);

      if (files.length > 0) {
        files.forEach((file) => {
          formData.append('files', file);
        });
      }

      try {
        (await axiosInstance.post('/feedback', formData))
          .data as Feedback;
      } catch (error) {
        console.error('Error while saving feedback', error);
        return null;
      }
    },
    [axiosInstance]
  );

  const updateFeedback = useCallback(
    async (feedback: Feedback) => {
      try {
        return (await axiosInstance.put(`/feedback/${feedback.uuid}`, feedback))
          .data as Feedback;
      } catch (error) {
        console.error('Error while updating feedback', error);
        return null;
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

  const downloadDocument = useCallback(
    async (downloadUrl: string, fileName: string): Promise<boolean> => {
      try {
        const response = await axiosInstance.get(downloadUrl, {
          responseType: 'blob',
        });

        const blob = new Blob([response.data]);

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return true;
      } catch (error) {
        console.error('Error while downloading document: ', error);
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
    downloadDocument,
  };
};

export default useApi;
