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
import { useParams } from 'react-router-dom';
import { useTypedSelector } from '@/stores/rootReducer';
import type { Feedback, Student } from '@/@custom-types/backendTypes';
import FeedbackModal from '@/components/FeedbackModal/FeedbackModal';
import Filter from '@/components/Filter/Filter';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { useTranslation } from 'react-i18next';
import useApi from '@/hooks/useApi';
import { ExamPublishState } from '@/@custom-types/enums';
import usePublishStatus from '@/hooks/usePublishStatus';

const ExamSubmissionPage = () => {
  const { t } = useTranslation();
  const { examUuid } = useParams();
  const { submitFeedback } = useApi();
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback>();
  const [publishStatus, setIsPublished] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitted'>('idle');
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const exams = useTypedSelector((state) => state.exam.data);
  const feedbacks = useTypedSelector((state) => state.feedback.data);
  const submissions = useTypedSelector((state) => state.submission.data);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const { setFeedbackStatus } = usePublishStatus();

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

  const submit = async () => {
    const feedbackList: Feedback[] = students.map((student) => {
      return feedbacks[`${examUuid}:${student.uuid}`];
    });
    const success = await submitFeedback(feedbackList);

    if (success && examUuid) {
      setStatus('submitted');
      setError(false);
      setFeedbackStatus(examUuid, ExamPublishState.PUBLISHED);
    } else {
      setStatus('idle');
      setError(true);
    }
  };

  useEffect(() => {
    if (!examUuid) return;

    const anyPublished = students.some((student) => {
      const gradeFromStudent = feedbacks[`${examUuid}:${student.uuid}`];
      return gradeFromStudent?.publishStatus === ExamPublishState.PUBLISHED;
    });

    setIsPublished(anyPublished);
  }, [students, feedbacks, examUuid]);

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
            {status === 'idle' && !publishStatus && (
              <Button
                disabled={publishStatus}
                onClick={submit}
                sx={{ width: '8em' }}
              >
                {t('components.testCard.submit.submit')}
              </Button>
            )}
            {(status === 'submitted' || publishStatus) && (
              <Button variant="soft" color={'success'} sx={{ width: '8em' }}>
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
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          gap: 3,
          paddingTop: 3,
          justifyContent: 'space-around',
        }}
      >
        {filteredStudents.map((student) => {
          if (!examUuid) return null;
          const gradeFromStudent = feedbacks[`${examUuid}:${student.uuid}`];
          const studentSubmissions = submissions[`${examUuid}:${student.uuid}`];

          const publishStatus =
            gradeFromStudent?.publishStatus ?? ExamPublishState.UNPUBLISHED;

          return (
            <ExamSubmissionCard
              key={student.uuid}
              student={student}
              exam={exams[examUuid]}
              feedback={gradeFromStudent}
              onStudentClick={handleOpenModal}
              submission={studentSubmissions}
              published={publishStatus}
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
