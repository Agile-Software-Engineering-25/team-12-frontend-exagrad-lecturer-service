import ExamSubmissionCard from '@/components/ExamSubmissionCard/ExamSubmissionCard';
import {
  Box,
  Button,
  FormHelperText,
  Stack,
  Tooltip,
  Typography,
} from '@mui/joy';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTypedSelector } from '@/stores/rootReducer';
import type { Feedback, Student } from '@/@custom-types/backendTypes';
import FeedbackModal from '@/components/FeedbackModal/FeedbackModal';
import Filter from '@/components/Filter/Filter';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { useTranslation } from 'react-i18next';
import useApi from '@/hooks/useApi';
import { FeedbackPublishStatus } from '@/@custom-types/enums';
import usePublishStatus from '@/hooks/usePublishStatus';

const ExamSubmissionPage = () => {
  const { t } = useTranslation();
  const { examUuid } = useParams();
  const { submitFeedback } = useApi();
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback>();
  const [publishStatus, setIsPublished] = useState(false);
  const [fullyGraded, setFullyGraded] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitted'>('idle');
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const exams = useTypedSelector((state) => state.exam.data);
  const feedbacks = useTypedSelector((state) => state.feedback.data);
  const submissions = useTypedSelector((state) => state.submission.data);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const { setFeedbackStatus } = usePublishStatus();
  const navigate = useNavigate();

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

  const handleGoBack = () => {
    navigate(-1);
  };

  const getFeedback = useCallback(
    (studentUuid: string) => feedbacks[`${examUuid}:${studentUuid}`],
    [feedbacks, examUuid]
  );

  const getSubmission = useCallback(
    (studentUuid: string) => submissions[`${examUuid}:${studentUuid}`],
    [submissions, examUuid]
  );

  useEffect(() => {
    if (!currentStudent || !examUuid) {
      setCurrentFeedback(undefined);
      return;
    }

    const feedback = getFeedback(currentStudent.uuid);
    setCurrentFeedback(feedback);
  }, [currentStudent?.uuid, getFeedback, examUuid]);

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
    [currentExam, currentIndex]
  );

  const filteredStudents = students.filter(
    (student) => {
      const gradeFromStudent = getFeedback(student.uuid);

      const isGraded = gradeFromStudent?.grade > 0;
      const isUngraded =
        gradeFromStudent == null || gradeFromStudent.grade == null;

      if (selectedStatuses.length === 0) return true;

      return (
        (selectedStatuses.includes('graded') && isGraded) ||
        (selectedStatuses.includes('ungraded') && isUngraded)
      );
    },
    [students, getFeedback, selectedStatuses]
  );

  const studentsWithSubmission = useMemo(
    () => filteredStudents.filter((student) => getSubmission(student.uuid)),
    [filteredStudents, getSubmission]
  );
  const studentsWithoutSubmission = useMemo(
    () => filteredStudents.filter((student) => !getSubmission(student.uuid)),
    [filteredStudents, getSubmission]
  );

  const allStudents = [...studentsWithSubmission, ...studentsWithoutSubmission];

  const submit = async () => {
    const feedbackList = students
      .map((student) => getFeedback(student.uuid))
      .filter(Boolean);

    const success = await submitFeedback(feedbackList);

    if (success && examUuid) {
      setStatus('submitted');
      setError(false);
      setFeedbackStatus(examUuid, FeedbackPublishStatus.PUBLISHED);
    } else {
      setStatus('idle');
      setError(true);
    }
  };

  useEffect(() => {
    if (!examUuid) return;

    const published = students.every((student) => {
      const gradeFromStudent = getFeedback(student.uuid);
      return (
        gradeFromStudent?.publishStatus === FeedbackPublishStatus.PUBLISHED
      );
    });

    setIsPublished(published);
  }, [students, getFeedback, examUuid]);

  useEffect(() => {
    if (!examUuid) return;

    const fullyGraded = students.every(
      (student) => getFeedback(student.uuid) != null
    );

    setFullyGraded(fullyGraded);
  }, [students, getFeedback, examUuid]);

  return (
    <>
      <Box display={'flex'} justifyContent={'end'} gap={2} paddingInline={3}>
        <Filter
          label={t('components.testCard.filter.labelStatus')}
          customList={['graded', 'ungraded']}
          placeholder={t('components.testCard.filter.placeholderStatus')}
          onChange={setSelectedStatuses}
        />
        <Stack gap={1}>
          <Tooltip title={t('components.testCard.submit.info')}>
            <InfoOutlineIcon
              sx={{
                opacity: 0.65,
                width: 17,
                top: 65,
                right: 38,
                position: 'absolute',
              }}
            />
          </Tooltip>
          <Typography sx={{ paddingTop: 2, paddingLeft: 1 }}>
            {t('components.testCard.submit.submit')}
          </Typography>
          <Box>
            {status === 'idle' && (
              <Button
                disabled={!fullyGraded || publishStatus}
                onClick={submit}
                sx={{ width: '8em' }}
              >
                {t('components.testCard.submit.submit')}
              </Button>
            )}
            {status === 'submitted' && publishStatus && fullyGraded && (
              <Button
                variant="soft"
                color={'success'}
                onClick={handleGoBack}
                sx={{ width: '8em' }}
              >
                {t('components.testCard.submit.done')}
              </Button>
            )}
          </Box>
        </Stack>
      </Box>
      <Box
        display={'flex'}
        flexDirection={'row-reverse'}
        sx={{ paddingInline: 3 }}
      >
        {error && (
          <FormHelperText sx={{ color: '#f50057' }}>
            {t('components.testCard.submit.failed')}
          </FormHelperText>
        )}
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 2,
          pt: 3,
          paddingLeft: 3,
        }}
      >
        {allStudents.map((student) => {
          if (!examUuid) return;
          const gradeFromStudent = getFeedback(student.uuid);
          const studentSubmissions = getSubmission(student.uuid);
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
