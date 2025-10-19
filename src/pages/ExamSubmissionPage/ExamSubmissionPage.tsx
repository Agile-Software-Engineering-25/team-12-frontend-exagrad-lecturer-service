import ExamSubmissionCard from '@/components/ExamSubmissionCard/ExamSubmissionCard';
import { Box } from '@mui/joy';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTypedSelector } from '@/stores/rootReducer';
import type { Feedback, Student } from '@/@custom-types/backendTypes';
import FeedbackModal from '@/components/FeedbackModal/FeedbackModal';
import { useTranslation } from 'react-i18next';
import Filter from '@/components/ExamCard/Filter';

const ExamSubmissionPage = () => {
  const { t } = useTranslation();
  const { examUuid } = useParams();
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback>();
  const [open, setOpen] = useState(false);
  const exams = useTypedSelector((state) => state.exam.data);
  const feedbacks = useTypedSelector((state) => state.feedback.data);
  const submissions = useTypedSelector((state) => state.submission.data);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

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

  const filteredStudents = students.filter((student) => {
    const gradeFromStudent = feedbacks[`${examUuid}:${student.uuid}`];

    const isGraded = gradeFromStudent?.grade > 0;
    const isUngraded =
      gradeFromStudent == null || gradeFromStudent.grade == null;

    if (selectedStatuses.length === 0) return true;

    return (
      (selectedStatuses.includes('graded') && isGraded) ||
      (selectedStatuses.includes('ungraded') && isUngraded)
    );
  });

  const studentsWithSubmission = useMemo(
    () =>
      filteredStudents.filter(
        (student) => submissions[`${examUuid}:${student.uuid}`]
      ),
    [filteredStudents, submissions, examUuid]
  );
  const studentsWithoutSubmission = useMemo(
    () =>
      filteredStudents.filter(
        (student) => !submissions[`${examUuid}:${student.uuid}`]
      ),
    [filteredStudents, submissions, examUuid]
  );

  return (
    <>
      <Box display={'flex'} justifyContent={'end'} gap={2} paddingInline={2}>
        <Filter
          label={t('components.testCard.filter.labelStatus')}
          customList={['graded', 'ungraded']}
          placeholder={t('components.testCard.filter.placeholderStatus')}
          onChange={setSelectedStatuses}
        />
      </Box>
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
          if (!examUuid) return;
          const gradeFromStudent = feedbacks[`${examUuid}:${student.uuid}`];
          const studentSubmissions = submissions[`${examUuid}:${student.uuid}`];
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
          if (!examUuid) return;
          const gradeFromStudent = feedbacks[`${examUuid}:${student.uuid}`];
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
