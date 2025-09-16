import ExamSubmissionCard from '@/components/ExamSubmissionCard/ExamSubmissionCard';
import { Box } from '@mui/joy';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTypedSelector } from '@/stores/rootReducer';

const ExamSubmissionPage = () => {
  const { examUuid } = useParams();
  const exams = useTypedSelector((state) => state.exam.data);
  const feedbacks = useTypedSelector((state) => state.feedback.data);

  const currentExam = useMemo(() => {
    return Object.values(exams).find((exam) => exam.uuid === examUuid);
  }, [exams, examUuid]);

  const students = useMemo(() => {
    return currentExam?.assignedStudents || [];
  }, [currentExam]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        paddingTop: 3,
        justifyContent: 'space-around',
      }}
    >
      {students.map((student) => {
        if (!examUuid) return null;
        const gradeFromStudent = feedbacks[`${examUuid}:${student.uuid}`];
        return (
          <ExamSubmissionCard
            key={student.uuid}
            student={student}
            exam={exams[examUuid]}
            feedback={gradeFromStudent}
          />
        );
      })}
    </Box>
  );
};

export default ExamSubmissionPage;
