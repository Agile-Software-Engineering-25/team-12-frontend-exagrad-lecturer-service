import useApi from '@/hooks/useApi';
import type { RootState } from '@/stores';
import { setExams } from '@/stores/slices/examSlice';
import ExamCard from '@components/ExamCard/ExamCard';
import { Box } from '@mui/joy';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ExamsPage = () => {
  const dispatch = useDispatch();
  const { requestExams } = useApi();
  const requestedExams = useSelector((state: RootState) => state.exam.data);
  const exams = Object.values(requestedExams);

  const fetchExams = async (lecturer: string) => {
    const exams = await requestExams(lecturer);
    if (exams) {
      dispatch(setExams(exams));
    }
  };

  useEffect(() => {
    fetchExams('Tom');
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
