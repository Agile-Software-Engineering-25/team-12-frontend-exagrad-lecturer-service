import useAxiosInstance from '@hooks/useAxiosInstance';
import { BACKEND_BASE_URL } from '@/config';
import { useCallback } from 'react';
import type { Exam, Grade, Submission } from '@custom-types/backendTypes';

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

  const requestExam = useCallback(
    async (examUuid: string) => {
      try {
        const response = await axiosInstance.get(
          `/lecturer/exam/${examUuid}/submission`
        );
        return response.data as Submission;
      } catch (error) {
        console.error('Error while getting exam: ', error);
        return false;
      }
    },
    [axiosInstance]
  );

  const requestGrades = useCallback(
    async (studentUuid: string) => {
      try {
        const response = await axiosInstance.get(
          `/lecturer/exam/${studentUuid}/grade`
        );
        return response.data as Grade;
      } catch (error) {
        console.error('Error while getting grade data: ', error);
        return false;
      }
    },
    [axiosInstance]
  );

  return {
    requestExams,
    requestExam,
    requestGrades,
  };
};

export default useApi;
