import useApi from '@/hooks/useApi';
import type { RootState } from '@/stores';
import { setExams } from '@/stores/slices/examSlice';
import ExamCard from '@components/ExamCard/ExamCard';
import { Box } from '@mui/joy';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Exams = () => {
  const dispatch = useDispatch();
  const requestedExams = useSelector((state: RootState) => state.exam.data);
  const { requestExams } = useApi();

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
      {requestedExams.map((exam) => (
        <ExamCard exam={exam} key={exam.name} />
      ))}
    </Box>
  );
};

export default Exams;
