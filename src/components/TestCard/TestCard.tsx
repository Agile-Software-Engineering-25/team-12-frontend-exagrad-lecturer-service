import type { Grade, Submission } from '@/@custom-types/backendTypes';
import useApi from '@/hooks/useApi';
import { Card, Divider, Typography } from '@mui/joy';
import { useEffect, useState } from 'react';

const TestCard = (props: { examUuid: string }) => {
  const { requestExam, requestGrades } = useApi();
  const [submissions, setSubmission] = useState<Submission>();
  const [grade, setGrade] = useState<Grade>();

  const fetchSubmissions = async () => {
    const exam = await requestExam(props.examUuid);
    if (exam) {
      setSubmission(exam);
    }

    if (submissions) {
      for (const submission of submissions.studentUuid) {
        const grade = await requestGrades(submission);
        if (grade) {
          setGrade(grade);
        }
      }
    }
  };
  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <Card>
      <Divider inset="none" />
      <Typography>{grade?.grade ?? 'loading'}</Typography>
      <Typography>{grade?.points ?? 'loading'}</Typography>
      <Typography>{submissions?.totalPoints ?? 'loading'}</Typography>
    </Card>
  );
};

export default TestCard;
