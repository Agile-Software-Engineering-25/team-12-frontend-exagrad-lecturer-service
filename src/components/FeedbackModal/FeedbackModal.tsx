import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  Stack,
  Textarea,
  Tooltip,
  Typography,
} from '@mui/joy';
import DataUploader from './DataUploader';
import type {
  FileReference,
  Exam,
  Feedback,
  Student,
} from '@/@custom-types/backendTypes';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useApi from '@/hooks/useApi';
import { ExamType } from '@/@custom-types/enums';
import { getGradeFromPoints } from './GradeCalc';

interface FeedbackModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  student: Student;
  exam: Exam;
  feedback: Feedback;
}

const FeedbackModal = (props: FeedbackModalProps) => {
  const { t } = useTranslation();
  const { saveFeedback } = useApi();

  const [files, setFiles] = useState<FileReference[]>([]);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [grade, setGrade] = useState<number | undefined>(props.feedback?.grade);
  const [points, setPoints] = useState('');
  const [currentStudent, setStudent] = useState<Student>(props.student);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const examHasSubmissions = [ExamType.PROJECT, ExamType.OTHERS];
  const isValid = !error || grade !== undefined;

  const hasSubmission = examHasSubmissions.includes(props.exam.examType);

  /**
   * Navigates to the next or previous student in the exam
   */
  const navigateStudent = useCallback(
    (direction: 'next' | 'back') => {
      const studentIndex = props.exam.assignedStudents.findIndex(
        (student) => student.uuid === currentStudent.uuid
      );

      const index = direction === 'next' ? studentIndex + 1 : studentIndex - 1;
      const student = props.exam.assignedStudents[index];

      if (!student) {
        return;
      }

      setPoints('');
      setComment('');
      setFiles([]);
      setStatus('idle');
      setStudent(student);
    },
    [currentStudent.uuid, props.exam.assignedStudents]
  );

  /**
   * Saves the feedback for the current student
   */
  const handleSave = async () => {
    setStatus('loading');

    if (!grade || !points) {
      setError(t('components.gradeExam.errorMessages.notGraded'));
      setStatus('idle');
      return;
    }

    const gradedExam: Feedback = {
      gradedAt: new Date(Date.now()),
      grade: grade,
      examUuid: props.exam.uuid,
      lecturerUuid: crypto.randomUUID.toString(), // TODO: change this the the users ID
      studentUuid: currentStudent.uuid,
      submissionUuid: props.feedback.submissionUuid,
      comment: comment,
      points: Number(points),
      fileReference: files,
    };

    await new Promise((resolve) => setTimeout(resolve, 600));

    setStatus('done');
    saveFeedback(gradedExam);
  };

  /**
   * Validates points input and updates grade accordingly
   * Returns the validation result with grade and error state
   */
  const validatePoints = useCallback(
    (pointsInput: string) => {
      if (!pointsInput) {
        return {
          grade: props.feedback?.grade,
          error: '',
        };
      }

      const numericInput = Number(pointsInput);

      if (numericInput > props.exam.totalPoints) {
        return {
          grade: undefined,
          error: t('components.gradeExam.errorMessage.numberToHigh'),
        };
      }

      return {
        grade: getGradeFromPoints(numericInput),
        error: '',
      };
    },
    [props.exam.totalPoints, props.feedback?.grade, t]
  );

  /**
   * Handles points input - only allows numeric values
   */
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, '');

    setPoints(inputValue);
  };

  // Validate points and update grade with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      const validation = validatePoints(points);
      setGrade(validation.grade);
      setError(validation.error);
    }, 200);

    return () => clearTimeout(timeout);
  }, [points, validatePoints]);

  return (
    <Modal open={props.open} onClose={() => props.setOpen(false)}>
      <ModalDialog sx={{ width: '30vw' }}>
        <DialogTitle>{props.exam.name}</DialogTitle>
        <DialogContent>{t('components.gradeExam.subtitle')}</DialogContent>
        <Divider inset="none" />
        <Stack spacing={2}>
          {/* Student Information */}
          <FormControl>
            <FormLabel>
              {t('components.gradeExam.matriculationNumber')}
            </FormLabel>
            <Typography>{currentStudent.matriculationNumber}</Typography>
          </FormControl>

          {/* File Submissions (for projects only) */}
          {hasSubmission && (
            <FormControl>
              <FormLabel>{t('components.gradeExam.file')}</FormLabel>
              <Stack>
                {files &&
                  files.map((file, index) => (
                    <Typography key={index}>{file.filename}</Typography>
                  ))}
              </Stack>
            </FormControl>
          )}

          {/* Points and Grade Input */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <FormControl>
              <FormLabel>{t('components.gradeExam.points')}</FormLabel>
              <Tooltip title={t('components.gradeExam.hint')}>
                <InfoOutlineIcon
                  sx={{
                    width: 17,
                    position: 'absolute',
                    top: -10,
                    left: 45,
                  }}
                />
              </Tooltip>
              <Input
                autoFocus
                required
                placeholder={t('components.gradeExam.placeholder')}
                value={points ?? ''}
                onChange={handleInput}
                color={!isValid ? 'danger' : 'primary'}
                sx={{ width: '20vw' }}
                endDecorator={
                  <Typography
                    paddingLeft={1}
                    fontSize="100%"
                    sx={{ opacity: '80%' }}
                  >
                    {'/ ' + props.exam.totalPoints}
                  </Typography>
                }
              />
            </FormControl>

            <FormControl sx={{ width: '5vw' }}>
              <FormLabel>{t('components.gradeExam.grade')}</FormLabel>
              <Typography height={'100%'} color="primary" paddingBlock={1.5}>
                {grade ?? 'N/A'}
              </Typography>
            </FormControl>
            {!isValid && <FormHelperText>{error}</FormHelperText>}
          </Box>

          {/* Feedback File Upload */}
          <FormControl>
            <FormLabel>{t('components.gradeExam.feedback')}</FormLabel>
            <DataUploader files={files} setFiles={setFiles} />
          </FormControl>

          {/* Comment Section */}
          <FormControl>
            <FormLabel>{t('components.gradeExam.comment.title')}</FormLabel>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('components.gradeExam.comment.placeholder')}
            />
          </FormControl>

          {/* Action Buttons */}
          <FormControl>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Button
                disabled={status === 'loading'}
                variant="outlined"
                onClick={() => navigateStudent('back')}
                sx={{ width: '49%' }}
              >
                {t('components.gradeExam.button.back')}
              </Button>

              {status === 'idle' && (
                <Button onClick={handleSave} sx={{ width: '49%' }}>
                  {t('components.gradeExam.button.save')}
                </Button>
              )}

              {status === 'loading' && (
                <Button disabled sx={{ width: '49%' }}>
                  {t('components.gradeExam.button.loading')}
                </Button>
              )}

              {status === 'done' && (
                <Button
                  color="success"
                  sx={{ width: '49%' }}
                  onClick={() => navigateStudent('next')}
                >
                  {t('components.gradeExam.button.next')}
                </Button>
              )}
            </Box>
          </FormControl>
        </Stack>
      </ModalDialog>
    </Modal>
  );
};

export default FeedbackModal;
