import useAxiosInstance from '@hooks/useAxiosInstance';
import { BACKEND_BASE_URL } from '@/config';
import { useCallback } from 'react';
import type { Exam, Grade } from '@custom-types/backendTypes';

const useApi = () => {
  const axiosInstance = useAxiosInstance(BACKEND_BASE_URL);

  const requestExams = useCallback(
    async (lecturerUuid: string) => {
      try {
        const response = await axiosInstance.get(`/exams/${lecturerUuid}`);
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
        const response = await axiosInstance.get('/grades/', {
          params: {
            examUuid: examUuid,
            studentUuid: studentUuid,
          },
        });
        return response.data as Grade;
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
