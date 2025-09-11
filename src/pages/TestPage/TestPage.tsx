import TestCard from '@/components/TestCard/TestCard';
import useApi from '@/hooks/useApi';
import { Box } from '@mui/joy';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/stores';

const TestPage = () => {
  const { examUuid } = useParams();
  const dispatch = useDispatch();


  useEffect(() => {
  }, [examUuid]);

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
      {requestSubmission?.student?.map((student, index) => {
        const correspondingGrade = requestSubmission.grade[index];

        return (
          <TestCard
            key={student.id}
            matriculationNumber={student.matricalNumber}
            grade={correspondingGrade?.grade}
            points={correspondingGrade?.points}
            totalpoints={requestSubmission.totalPoints}
          />
        );
      })}
    </Box>
  );
};

export default TestPage;
