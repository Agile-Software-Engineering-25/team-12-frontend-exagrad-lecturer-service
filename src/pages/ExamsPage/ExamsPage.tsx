import useExamDataLoading from '@/hooks/useDataLoading';
import type { RootState } from '@/stores';
import ExamCard from '@components/ExamCard/ExamCard';
import { Box } from '@mui/joy';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ExamsPage = () => {
  const requestedExams = useSelector((state: RootState) => state.exam.data);
  const exams = Object.values(requestedExams);
  const { loadExams } = useExamDataLoading();

  useEffect(() => {
    loadExams('Tom');
  }, []);

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
      {exams.map((exam) => (
        <ExamCard exam={exam} key={exam.uuid} />
      ))}
    </Box>
  );
};

export default ExamsPage;
