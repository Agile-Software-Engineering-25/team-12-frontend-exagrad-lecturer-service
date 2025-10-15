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
import DataUploader from './DataUploader';
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
import { setFeedback } from '@stores/slices/feedbackSlice';
import { BorderColor } from '@mui/icons-material';

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
  const { saveFeedback, downloadDocument } = useApi();
  const dispatch = useDispatch();

  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [comment, setComment] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'saved'>('idle');
  const [points, setPoints] = useState<string>();
  const [grade, setGrade] = useState<number | undefined>();
  const [uploadedDocuments, setUploadedDocuments] = useState<FeedbackDocumentResponse[]>([]);

  /**
   * Saves the feedback for the current student
   */
  const handleSave = async () => {
    if (!grade || !points) {
      setError(t('components.gradeExam.errorMessage.notGraded'));
      return;
    }

    const feedbackData: FeedbackRequest = {
      gradedAt: new Date().toISOString(), // Wichtig: Datum hinzufügen
      grade: grade,
      examUuid: props.exam.uuid,
      lecturerUuid: "LE12345", // TODO: Ersetzen
      studentUuid: props.student.uuid,
      submissionUuid: props.feedback?.submissionUuid,
      comment: comment,
      points: Number(points),
    };

    await new Promise((resolve) => setTimeout(resolve, 600));

    setStatus('saved');
    console.log(feedbackData);
    console.log(files);
    saveFeedback(feedbackData, files);
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
    setFiles(prevFiles => Array.isArray(selectedFiles) ? [...prevFiles, ...selectedFiles] : [...prevFiles, selectedFiles]);
  };

  const onDeleteFile = (fileName: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };

  const onDownload = (downloadUrl: string, fileName: string) => {
    downloadDocument(downloadUrl, fileName);
  };

  //http://80.158.79.52:9000/feedback-documents/feedback-documents/2025/675b12a4-ac73-444d-97e7-8ee302c8d24d-Zwischenzeugnis.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=my-access-key%2F20251015%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251015T073530Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=818444aad283f834c7649959cb8e8a56e2033411bc2ebf4a988b2b0e4be86f60


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
      setFiles(/* props.feedback?.fileReference || */[]);
      setGrade(props.feedback?.grade);
      setPoints(
        props.feedback?.points != null ? String(props.feedback.points) : ''
      );
    }
  }, [props.feedback, props.open]);

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

          <FormControl sx={{ width: '4', paddingRight: 2 }}>
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
          dragDropText='Dateien hochladen'
          browseText='Durchsuchen'
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
                onDelete={() => console.log('Delete file ' + doc.fileName)}
                onClick={() => onDownload(
                  doc.downloadUrl,
                  doc.fileName
                )}
              />
            ))}
          </Box>
        )}

        {files.length > 0 && (
          <Tooltip title="Datei ist neu und wird beim Speichern hochgeladen">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
              {files.map((doc) => (
                <FileChip
                  filename={
                    doc.name ||
                    t('components.dokumentModal.unknownFile', 'Unbekannte Datei')
                  }
                  onDelete={() => onDeleteFile(doc.name)}
                  containerSX={{ opacity: 0.6, borderColor: '#C2CAD5', color: '#6B7280' }}
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
