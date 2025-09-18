import ExamSubmissionCard from '@/components/ExamSubmissionCard/ExamSubmissionCard';
import { Box } from '@mui/joy';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTypedSelector } from '@/stores/rootReducer';
import type { Submission } from '@custom-types/backendTypes.ts';
import { BACKEND_BASE_URL } from '@/config.ts';
import axios from 'axios';

const ExamSubmissionPage = () => {
  const { examUuid } = useParams();
  const exams = useTypedSelector((state) => state.exam.data);
  const feedbacks = useTypedSelector((state) => state.feedback.data);
  const [submissions, setSubmissions] = useState<null | Submission[]>(null);

  const currentExam = useMemo(() => {
    return Object.values(exams).find((exam) => exam.uuid === examUuid);
  }, [exams, examUuid]);

  const students = useMemo(() => {
    return currentExam?.assignedStudents || [];
  }, [currentExam]);

  const totalPoints = useMemo(() => {
    return currentExam?.totalPoints ?? 0;
  }, [currentExam]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_BASE_URL}/submissions/for-exam/${examUuid}`
        );
        setSubmissions(response.data as Submission[]);
      } catch (error) {
        console.error('Error while getting exam: ', error);
        setSubmissions(null);
      }
    };
    fetchSubmissions();
  }, [examUuid]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        padding: 3,
        justifyContent: 'start',
      }}
    >
      {students.map((student) => {
        if (!examUuid) return null;
        const gradeFromStudent = feedbacks[`${examUuid}:${student.uuid}`];
        if (submissions !== null) {
          const submissionsFromStudent: Submission | undefined =
            submissions.find(
              (submissions) => submissions.studentId == student.uuid
            );
          if (!submissionsFromStudent) {
            return;
          }
          return (
            <ExamSubmissionCard
              key={student.uuid}
              matriculationNumber={student.matriculationNumber}
              feedback={gradeFromStudent}
              totalPoints={totalPoints}
              files={submissionsFromStudent.fileUpload}
            />
          );
        }
        return (
          <ExamSubmissionCard
            key={student.uuid}
            matriculationNumber={student.matriculationNumber}
            feedback={gradeFromStudent}
            totalPoints={totalPoints}
          />
        );
      })}
    </Box>
  );
};

export default ExamSubmissionPage;
