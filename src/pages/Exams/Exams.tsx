import type { Exam } from '@/@custom-types/backendTypes';
import useApi from '@/hooks/useApi';
import ExamCard from '@components/ExamCard/ExamCard';
import { Box } from '@mui/joy';
import { useEffect, useState } from 'react';

const Exams = () => {
  const [requestedExams, setRequestedExams] = useState<Exam[]>([]);
  const { requestExams } = useApi();

  const fetchExams = async (lecturer: string) => {
    const exams = await requestExams(lecturer);
    if (exams) {
      setRequestedExams(exams);
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
      {requestedExams.map((exam, index) => (
        <ExamCard exam={exam} index={index} />
      ))}
    </Box>
  );
};

export default Exams;
