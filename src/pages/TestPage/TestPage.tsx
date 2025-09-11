import TestCard from '@/components/TestCard/TestCard';
import { Box } from '@mui/joy';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTypedSelector } from '@/stores/rootReducer';

const TestPage = () => {
  const { examUuid } = useParams();
  const exams = useTypedSelector((state) => state.exam.data);
  const grades = useTypedSelector((state) => state.grade.data);

  const currentExam = useMemo(() => {
    return Object.values(exams).find((exam) => exam.uuid === examUuid);
  }, [exams, examUuid]);

  const students = useMemo(() => {
    return currentExam?.assignedStudents || [];
  }, [currentExam]);

  const totalPoints = useMemo(() => {
    return currentExam?.totalPoints ?? 0;
  }, [currentExam]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        paddingTop: 3,
        justifyContent: 'space-around',
      }}
    >
      {students.map((student) => {
        const gradeFromStudent = grades[student.uuid];
        return (
          <TestCard
            key={student.uuid}
            matriculationNumber={student.matriculationNumber}
            grade={gradeFromStudent?.grade}
            points={gradeFromStudent?.points}
            totalpoints={totalPoints}
          />
        );
      })}
    </Box>
  );
};

export default TestPage;
