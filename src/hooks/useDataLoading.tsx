import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import useApi from '@/hooks/useApi';
import { setExams } from '@/stores/slices/examSlice';
import { setGrades } from '@/stores/slices/gradeSlice';
import type { Feedback } from '@/@custom-types/backendTypes';

const useExamDataLoading = () => {
  const dispatch = useDispatch();
  const { requestExams, requestGrade } = useApi();

  const loadExams = useCallback(
    async (lecturer: string) => {
      const exams = await requestExams(lecturer);
      if (exams) {
        dispatch(setExams(exams));
      }
    },
    [requestExams, dispatch]
  );

  const loadGradesForExam = useCallback(
    async (examUuid: string, studentUuids: string[]) => {
      const gradePromises = studentUuids.map((studentUuid) =>
        requestGrade(examUuid, studentUuid)
      );

      const results = await Promise.all(gradePromises);
      const grades = results.filter((grade): grade is Feedback =>
        Boolean(grade)
      );

      if (grades.length > 0) {
        dispatch(setGrades(grades));
      }

      return grades;
    },
    [requestGrade, dispatch]
  );

  return {
    loadExams,
    loadGradesForExam,
  };
};

export default useExamDataLoading;
