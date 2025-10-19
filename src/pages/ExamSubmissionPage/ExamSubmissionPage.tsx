import ExamSubmissionCard from '@/components/ExamSubmissionCard/ExamSubmissionCard';
import { Box } from '@mui/joy';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTypedSelector } from '@/stores/rootReducer';
import type { Feedback, Student } from '@/@custom-types/backendTypes';
import FeedbackModal from '@/components/FeedbackModal/FeedbackModal';

const ExamSubmissionPage = () => {
  const { examUuid } = useParams();
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback>();
  const [open, setOpen] = useState(false);
  const exams = useTypedSelector((state) => state.exam.data);
  const feedbacks = useTypedSelector((state) => state.feedback.data);
  const submissions = useTypedSelector((state) => state.submission.data);

  const currentExam = useMemo(() => {
    return Object.values(exams).find((exam) => exam.uuid === examUuid);
  }, [exams, examUuid]);

  const students = useMemo(() => {
    return currentExam?.assignedStudents || [];
  }, [currentExam]);

  const currentIndex = useMemo(() => {
    return students.findIndex(
      (student) => student.uuid === currentStudent?.uuid
    );
  }, [currentStudent, students]);

  const navigationState = useMemo(() => {
    return {
      canGoBack: currentIndex > 0,
      canGoNext: currentIndex < students.length - 1,
    };
  }, [currentIndex, students.length]);

  useEffect(() => {
    if (!currentStudent || !examUuid) {
      setCurrentFeedback(undefined);
      return;
    }

    const feedback = feedbacks[`${examUuid}:${currentStudent.uuid}`];
    setCurrentFeedback(feedback);
  }, [currentStudent?.uuid, feedbacks, examUuid]);

  const handleOpenModal = useCallback((student: Student) => {
    setCurrentStudent(student);
    setOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setCurrentStudent(null);
    setOpen(false);
  }, []);

  const navigateStudent = useCallback(
    (direction: 'next' | 'back') => {
      if (!currentExam || currentIndex < 0) return;

      const newIndex =
        direction === 'next' ? currentIndex + 1 : currentIndex - 1;
      const newStudent = currentExam.assignedStudents[newIndex];

      if (newStudent) {
        setCurrentStudent(newStudent);
      }
    },
    [currentExam, currentStudent]
  );

  const studentsWithSubmission = useMemo(
    () =>
      students.filter((student) => submissions[`${examUuid}:${student.uuid}`]),
    [students, submissions, examUuid]
  );
  const studentsWithoutSubmission = useMemo(
    () =>
      students.filter((student) => !submissions[`${examUuid}:${student.uuid}`]),
    [students, submissions, examUuid]
  );

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          gap: 3,
          paddingTop: 3,
          justifyContent: 'space-around',
        }}
      >
        {studentsWithSubmission.map((student) => {
          const gradeFromStudent = feedbacks[`${examUuid}:${student.uuid}`];
          const studentSubmissions = submissions[`${examUuid}:${student.uuid}`];
          if (!examUuid) return;
          return (
            <ExamSubmissionCard
              key={student.uuid}
              student={student}
              exam={exams[examUuid]}
              feedback={gradeFromStudent}
              onStudentClick={handleOpenModal}
              submission={studentSubmissions}
            />
          );
        })}
        {studentsWithoutSubmission.map((student) => {
          const gradeFromStudent = feedbacks[`${examUuid}:${student.uuid}`];
          if (!examUuid) return;
          return (
            <ExamSubmissionCard
              key={student.uuid}
              student={student}
              exam={exams[examUuid]}
              feedback={gradeFromStudent}
              onStudentClick={handleOpenModal}
            />
          );
        })}
      </Box>
      {currentStudent && (
        <FeedbackModal
          key={currentStudent.uuid}
          open={open}
          setOpen={handleCloseModal}
          student={currentStudent}
          exam={currentExam!}
          feedback={currentFeedback}
          backStudentExist={navigationState.canGoBack}
          nextStudentExist={navigationState.canGoNext}
          navigation={navigateStudent}
        />
      )}
    </>
  );
};

export default ExamSubmissionPage;
