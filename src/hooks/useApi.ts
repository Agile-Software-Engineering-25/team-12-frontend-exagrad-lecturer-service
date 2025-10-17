import useAxiosInstance from '@hooks/useAxiosInstance';
import { BACKEND_BASE_URL } from '@/config';
import { useCallback } from 'react';
import type {
  Exam,
  Feedback,
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
        return response.data as Feedback[];
      } catch (error) {
        console.error('Error while getting exam: ', error);
        return false;
      }
    },
    [axiosInstance]
  );

  const saveFeedback = useCallback(
    async (feedbackData: FeedbackRequest, files: File[]) => {
      const formData = new FormData();
      formData.append('feedbackData', JSON.stringify(feedbackData));

      if (files.length > 0) {
        files.forEach((file) => {
          formData.append('files', file);
        });
      }

      try {
        axiosInstance.post('/feedback', formData);
        return true;
      } catch (error) {
        console.error('Error while saving feedback', error);
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
    downloadDocument,
  };
};

export default useApi;
