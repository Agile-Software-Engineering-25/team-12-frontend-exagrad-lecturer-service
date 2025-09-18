import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Textarea,
  Tooltip,
  Typography,
} from '@mui/joy';
import GenericModal from '@agile-software/shared-components/src/components/Modal/Modal';
import DataUploader from './DataUploader';
import type {
  Exam,
  Feedback,
  FileReference,
  Student,
} from '@/@custom-types/backendTypes';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useApi from '@/hooks/useApi';
import { getGradeFromPoints } from './GradeCalc';
  import { useDispatch } from 'react-redux';
  import { setFeedback } from '@stores/slices/feedbackSlice';

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
  const dispatch = useDispatch();
 // Update with correct path

  const [files, setFiles] = useState<FileReference[]>([]);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [grade, setGrade] = useState<number | undefined>(props.feedback?.grade);
  const [points, setPoints] = useState('');
  const [currentStudent, setStudent] = useState<Student>(props.student);
  const [status, setStatus] = useState<'idle' | 'loading' | 'saved'>('idle');

  const isValid = !error || grade !== undefined;
  const submissions = props.feedback?.fileUpload;

  const studentIndex = props.exam.assignedStudents.findIndex(
    (student) => student.uuid === currentStudent.uuid
  );
  const isLastStudent = studentIndex === props.exam.assignedStudents.length - 1;

  /**
   * Navigates to the next or previous student in the exam
   */
  const navigateStudent = useCallback(
    (direction: 'next' | 'back') => {
      const index = direction === 'next' ? studentIndex + 1 : studentIndex - 1;
      const student = props.exam.assignedStudents[index];

      setPoints('');
      setComment('');
      setFiles([]);
      setStatus('idle');
      setStudent(student);
    },
    [props.exam.assignedStudents, studentIndex]
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
      submissionUuid: props.feedback?.submissionUuid,
      comment: comment,
      points: Number(points),
      fileReference: files,
    };

    await new Promise((resolve) => setTimeout(resolve, 600));

    setStatus('saved');
    saveFeedback(gradedExam);
    dispatch(setFeedback([gradedExam]));
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
   * Decides what function the primary button should have
   */
  const handlePrimaryAction = () => {
    if (isLastStudent) {
      props.setOpen(false);
    } else {
      navigateStudent('next');
    }
  };

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
    <GenericModal
      header={props.exam.name}
      open={props.open}
      setOpen={props.setOpen}
      disableEscape={false}
    >
      <Stack spacing={2}>
        {/* Student Information */}
        <FormControl>
          <FormLabel>{t('components.gradeExam.matriculationNumber')}</FormLabel>
          <Typography>{currentStudent.matriculationNumber}</Typography>
        </FormControl>

        {/* File Submissions */}
        {props.exam.fileUploadRequired && (
          <FormControl>
            <FormLabel>{t('components.gradeExam.file')}</FormLabel>
            <Stack spacing={1}>
              {submissions && submissions.length > 0 ? (
                submissions.map((file, index) => (
                  <Typography
                    component={'a'}
                    color="primary"
                    href={file.downloadLink!}
                    key={index}
                    sx={{
                      textDecoration: 'underline',
                    }}
                  >
                    {file.filename}
                  </Typography>
                ))
              ) : (
                <Typography>{t('components.gradeExam.noFiles')}</Typography>
              )}
            </Stack>
          </FormControl>
        )}

        {/* Points and Grade Input */}
        <Box
          sx={{
            width: '100%',
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
                  top: -8,
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
              disabled={status == 'saved'}
              sx={{ width: { sm: '150%', md: '100%', lg: '100%' } }}
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

          <FormControl sx={{ width: '4', paddingRight: 2 }}>
            <FormLabel>{t('components.gradeExam.grade')}</FormLabel>
            <Typography height={'100%'} color="primary" paddingBlock={1.5}>
              {grade ?? 'N/A'}
            </Typography>
          </FormControl>
        </Box>
        {!isValid && <FormHelperText>{error}</FormHelperText>}

        {/* Feedback File Upload : NOTE: Data Uploader will be a shared component*/}
        <FormControl>
          <FormLabel>{t('components.gradeExam.feedback')}</FormLabel>
          <DataUploader
            files={files}
            setFiles={setFiles}
            disabled={status == 'saved'}
          />
        </FormControl>

        {/* Comment Section */}
        <FormControl>
          <FormLabel>{t('components.gradeExam.comment.title')}</FormLabel>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('components.gradeExam.comment.placeholder')}
            sx={{ height: '150px', padding: '10px' }}
            disabled={status == 'saved'}
            aria-disabled={status == 'saved'}
          />
        </FormControl>

        {/* Action Buttons */}
        <FormControl>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Button
              disabled={status === 'loading' || studentIndex === 0}
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

            {status === 'saved' && (
              <Button
                color="success"
                sx={{ width: '49%' }}
                onClick={handlePrimaryAction}
              >
                {isLastStudent
                  ? t('components.gradeExam.button.done')
                  : t('components.gradeExam.button.next')}
              </Button>
            )}
          </Box>
        </FormControl>
      </Stack>
    </GenericModal>
  );
};

export default FeedbackModal;
