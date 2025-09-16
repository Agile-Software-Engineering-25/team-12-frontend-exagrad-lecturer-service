import { type ExamSubmission } from '@custom-types/backendTypes.ts';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BACKEND_BASE_URL } from '@/config';
import SubmissionsCard from '@components/SubmissionCard/SubmissionCard.tsx';
import { Box } from '@mui/joy';

const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState<ExamSubmission[]>();

  const fetchSubmission = (examId: string) =>
    axios({
      method: 'get',
      url: `${BACKEND_BASE_URL}/submissions/exam`,
      params: { examId },
    }).then((response) => {
      console.log(response);
      if (response.status != 200) {
        console.error(
          'An error occured while fetching the submissions: ' + response.status
        );
      }
      setSubmissions(response.data);
    });

  useEffect(() => {
    fetchSubmission('2');
  }, []);

  return (
    <Box display={'flex'}>
      {submissions?.map((submissions) => {
        console.log(submissions.studentId);
        return (
          <SubmissionsCard
            key={submissions.submissionId}
            matriculationNumber={submissions.studentId}
            grade={submissions.grade}
            fileUrl={submissions.fileUrl}
          />
        );
      })}
    </Box>
  );
};

export default SubmissionsPage;
