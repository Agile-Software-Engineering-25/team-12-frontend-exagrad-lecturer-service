import ExamSubmissionCard from '@/components/ExamSubmissionCard/ExamSubmissionCard';
import { Box } from '@mui/joy';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTypedSelector } from '@/stores/rootReducer';
import useDataLoading from '@hooks/useDataLoading.tsx';

const ExamSubmissionPage = () => {
  const { loadExamSubmissions } = useDataLoading();
  const { examUuid } = useParams();
  const exams = useTypedSelector((state) => state.exam.data);
  const feedbacks = useTypedSelector((state) => state.feedback.data);
  const submissions = useTypedSelector((state) => state.submission.data);

  useEffect(() => {
    const load = async (examUuid: string | undefined) => {
      if (!examUuid) {
        return;
      }
      await loadExamSubmissions(examUuid);
    };
    load(examUuid);
  }, [examUuid]);

  const currentExam = useMemo(() => {
    return Object.values(exams).find((exam) => exam.uuid === examUuid);
  }, [exams, examUuid]);

  const students = useMemo(() => {
    return currentExam?.assignedStudents || [];
  }, [currentExam]);

  const totalPoints = useMemo(() => {
    return currentExam?.totalPoints ?? 0;
  }, [currentExam]);

  if (!examUuid) return;
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        gap: 3,
        padding: 3,
        justifyContent: 'start',
      }}
    >
      {students.map((student) => {
        const gradeFromStudent = feedbacks[`${examUuid}:${student.uuid}`];
        if (submissions != undefined) {
          console.log(submissions);
          const submissionsFromStudent = submissions?.find(
            (submissions) => submissions.studentId == student.uuid
          );
          return (
            <ExamSubmissionCard
              key={student.uuid}
              matriculationNumber={student.matriculationNumber}
              feedback={gradeFromStudent}
              totalPoints={totalPoints}
              files={submissionsFromStudent?.fileUpload}
            />
          );
        }
      })}
    </Box>
  );
};

export default ExamSubmissionPage;
