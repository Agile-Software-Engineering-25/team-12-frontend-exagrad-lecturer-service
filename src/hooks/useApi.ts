import useAxiosInstance from '@hooks/useAxiosInstance';
import { BACKEND_BASE_URL } from '@/config';
import { useCallback } from 'react';
import type { Exam } from '@custom-types/backendTypes';

const useApi = () => {
  const axiosInstance = useAxiosInstance(BACKEND_BASE_URL);

  const requestExams = useCallback(
    async (lecturerUuid: string) => {
      try {
        const response = await axiosInstance.get('/lecturer/exams', {
          params: { lecturer: lecturerUuid },
        });
        return response.data as Exam[];
      } catch (error) {
        console.error('Error while getting exams: ', error);
        return false;
      }
    },
    [axiosInstance]
  );

  return {
    requestExams,
  };
};

export default useApi;
