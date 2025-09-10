import type { Submission } from '@/@custom-types/backendTypes';
import TestCard from '@/components/TestCard/TestCard';
import useApi from '@/hooks/useApi';
import { Box } from '@mui/joy';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TestPage = () => {
  const { examUuid } = useParams();
  const { requestExam } = useApi();
  const [submission, setSubmission] = useState<Submission>();

  const fetchSubmissions = async () => {
    if (!examUuid) {
      return;
    }

    console.log(examUuid);
    const exam = await requestExam(examUuid);
    if (!exam) {
      return;
    }

    setSubmission(exam);
  };

  useEffect(() => {
    fetchSubmissions();
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
      {submission?.student?.map((student, index) => {
        const correspondingGrade = submission.grade[index];

        return (
          <TestCard
            key={student.id}
            matriculationNumber={student.matricalNumber}
            grade={correspondingGrade?.grade}
            points={correspondingGrade?.points}
            totalpoints={submission?.totalPoints}
          />
        );
      })}
    </Box>
  );
};

export default TestPage;
