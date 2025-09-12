import useAxiosInstance from '@hooks/useAxiosInstance';
import { BACKEND_BASE_URL } from '@/config';
import { useCallback } from 'react';
import type { Exam, Feedback } from '@custom-types/backendTypes';
import type { W } from 'node_modules/react-router/dist/development/index-react-server-client-DRhjXpk2.d.mts';

const useApi = () => {
  const axiosInstance = useAxiosInstance(BACKEND_BASE_URL);

  const requestExams = useCallback(
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

  const requestGrade = useCallback(
    async (examUuid: string, studentUuid: string) => {
      try {
        const response = await axiosInstance.get('/grades', {
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

  return {
    requestExams,
    requestGrade,
  };
};

export default useApi;
