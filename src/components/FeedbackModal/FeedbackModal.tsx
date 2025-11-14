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
import FileChip from '@agile-software/shared-components/src/components/FileChip/FileChip';
import Dropzone from '@agile-software/shared-components/src/components/Dropzone/Dropzone';
import type {
  Exam,
  Feedback,
  FeedbackDocumentResponse,
  FeedbackRequest,
  Student,
} from '@/@custom-types/backendTypes';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useApi from '@/hooks/useApi';
import { getGradeFromPoints } from './GradeCalc';
import { useDispatch } from 'react-redux';
import { updateFeedbackSlice } from '@stores/slices/feedbackSlice';
import { FeedbackPublishStatus } from '@/@custom-types/enums';
import { useUser } from '@hooks/useUser';

interface FeedbackModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  student: Student;
  exam: Exam;
  feedback?: Feedback;
  nextStudentExist: boolean;
  backStudentExist: boolean;
  navigation: (direction: 'next' | 'back') => void;
}

const FeedbackModal = (props: FeedbackModalProps) => {
  const { t } = useTranslation();
  const { saveFeedback, updateFeedback, downloadDocument } = useApi();
  const { getUserId } = useUser();
  const dispatch = useDispatch();

  const [files, setFiles] = useState<File[]>([]);

  const lecturerUuid = getUserId() || 'fc6ac29a-b9dd-4b35-889f-2baff71f3be1';
  // Form state
  const [error, setError] = useState('');
  const [comment, setComment] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'saved'>('idle');
  const [points, setPoints] = useState<string>();
  const [grade, setGrade] = useState<number | undefined>();
  const [uploadedDocuments, setUploadedDocuments] = useState<
    FeedbackDocumentResponse[]
  >([]);

  /**
   * Saves the feedback for the current student
   */
  const handleSave = async () => {
    if (!grade || !points) {
      setError(t('components.gradeExam.errorMessage.notGraded'));
      return;
    }

    setStatus('loading');

    const feedbackRequest: FeedbackRequest = {
      gradedAt: new Date().toISOString(),
      grade: grade,
      examUuid: props.exam.uuid,
      lecturerUuid: lecturerUuid,
      studentUuid: props.student.uuid,
      submissionUuid: props.feedback?.submissionUuid,
      comment: comment,
      points: Number(points),
    };

    const gradedExam: Feedback = {
      uuid: props.feedback?.uuid,
      gradedAt: new Date().toISOString(),
      grade: grade,
      examUuid: props.exam.uuid,
      lecturerUuid: lecturerUuid,
      studentUuid: props.student.uuid,
      submissionUuid: props.feedback?.submissionUuid,
      comment: comment || '',
      points: Number(points),
      publishStatus: FeedbackPublishStatus.UNPUBLISHED,
    };

    const updatedFeedback: Feedback | null = gradedExam.uuid
      ? await updateFeedback(gradedExam, files, uploadedDocuments)
      : await saveFeedback(feedbackRequest, files);

    if (updatedFeedback) {
      setStatus('saved');
      dispatch(updateFeedbackSlice(updatedFeedback));
    } else {
      setStatus('idle');
      setError(t('components.gradeExam.errorMessage.saveFailed'));
    }
  };

  /**
   * Validates points input and updates grade accordingly
   * Returns the validation result with grade and error state
   */
  const validatePoints = useCallback(
    (pointsInput: string) => {
      if (!pointsInput) {
        return {
          grade: grade,
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
        grade: getGradeFromPoints(numericInput, props.exam.totalPoints),
        error: '',
      };
    },
    [props.exam.totalPoints, grade, t]
  );

  /**
   * Decides what function the primary button should have
   */
  const handlePrimaryAction = () => {
    if (props.nextStudentExist) {
      props.navigation('next');
    } else {
      props.setOpen(false);
    }
  };

  /**
   * Handles points input - only allows numeric values
   */
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, '');

    setPoints(inputValue);
  };

  /**
   * Handles file selection - turns FileList/single File into array of Files for endpoint
   */

  const handleFileSelection = (selectedFiles: File | File[]) => {
    setFiles((prevFiles) =>
      Array.isArray(selectedFiles)
        ? [...prevFiles, ...selectedFiles]
        : [...prevFiles, selectedFiles]
    );
  };

  const onDeleteFile = (fileIndex: number) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== fileIndex)
    );
  };

  const onDeleteUploadedDocument = (fileId: string) => {
    const newDocuments = uploadedDocuments.filter(
      (file) => file.uuid !== fileId
    );
    setUploadedDocuments(newDocuments);

    if (props.feedback) {
      dispatch(
        updateFeedbackSlice({
          ...props.feedback,
          fileReference: newDocuments,
        })
      );
    }
  };

  const onDownload = (downloadUrl: string, fileName: string) => {
    downloadDocument(downloadUrl, fileName);
  };

  // Validate points and update grade with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (points === undefined) {
        return;
      }

      const validation = validatePoints(points);
      setGrade(validation.grade);
      setError(validation.error);
    }, 200);

    return () => clearTimeout(timeout);
  }, [points, validatePoints]);

  // Set the values
  useEffect(() => {
    if (props.open) {
      setComment(props.feedback?.comment || '');
      setUploadedDocuments(props.feedback?.fileReference || []);
      setFiles([]);
      setGrade(props.feedback?.grade);
      setPoints(
        props.feedback?.points != null ? String(props.feedback.points) : ''
      );
      setError('');
    }
  }, [props.open, props.feedback]);

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
          <Typography>{props.student.matriculationNumber}</Typography>
        </FormControl>

        {/* File Submissions */}
        {props.exam.fileUploadRequired && (
          <FormControl>
            <FormLabel>{t('components.gradeExam.file')}</FormLabel>
            <Stack spacing={1}>
              {props.feedback?.fileUpload?.length ? (
                props.feedback.fileUpload.map((file, index) => (
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
              value={points}
              onChange={handleInput}
              color={error ? 'danger' : 'primary'}
              disabled={status === 'saved'}
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

          <FormControl sx={{ width: 25 }}>
            <FormLabel>{t('components.gradeExam.grade')}</FormLabel>
            <Typography height={'100%'} color="primary" paddingBlock={1.5}>
              {grade ?? 'N/A'}
            </Typography>
          </FormControl>
        </Box>
        {error && (
          <FormHelperText sx={{ color: '#f50057' }}>{error}</FormHelperText>
        )}

        <FormLabel>{t('components.gradeExam.feedback')}</FormLabel>
        <Dropzone
          onFileSelect={handleFileSelection}
          dragDropText="Dateien hochladen"
          browseText="Durchsuchen"
        />

        {uploadedDocuments.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
            {uploadedDocuments.map((doc) => (
              <FileChip
                key={doc.uuid}
                filename={
                  doc.fileName ||
                  t('components.dokumentModal.unknownFile', 'Unbekannte Datei')
                }
                onDelete={() => onDeleteUploadedDocument(doc.uuid)}
                onClick={() => onDownload(doc.downloadUrl, doc.fileName)}
              />
            ))}
          </Box>
        )}

        {files.length > 0 && (
          <Tooltip title="Datei ist neu und wird beim Speichern hochgeladen">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
              {files.map((doc, index) => (
                <FileChip
                  key={`new-file-${index}`}
                  filename={
                    doc.name ||
                    t(
                      'components.dokumentModal.unknownFile',
                      'Unbekannte Datei'
                    )
                  }
                  onDelete={() => onDeleteFile(index)}
                  containerSX={{
                    opacity: 0.6,
                    borderColor: '#C2CAD5',
                    color: '#6B7280',
                  }}
                />
              ))}
            </Box>
          </Tooltip>
        )}

        {/* Comment Section */}
        <FormControl>
          <FormLabel>{t('components.gradeExam.comment.title')}</FormLabel>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('components.gradeExam.comment.placeholder')}
            sx={{ height: '150px', padding: '10px' }}
            disabled={status == 'saved'}
          />
        </FormControl>

        {/* Action Buttons */}
        <FormControl>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Button
              disabled={status === 'loading' || !props.backStudentExist}
              variant="outlined"
              onClick={() => props.navigation('back')}
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
                {props.nextStudentExist
                  ? t('components.gradeExam.button.next')
                  : t('components.gradeExam.button.done')}
              </Button>
            )}
          </Box>
        </FormControl>
      </Stack>
    </GenericModal>
  );
};

export default FeedbackModal;
