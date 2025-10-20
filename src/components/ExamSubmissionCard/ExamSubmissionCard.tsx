import { Box, Button, Card, Chip, Divider, Stack, Typography } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import DownloadIcon from '@mui/icons-material/Download';
import type {
  Exam,
  Feedback,
  Student,
  Submission,
} from '@/@custom-types/backendTypes';
import { ExamPublishState } from '@/@custom-types/enums';

interface ExamSubmissionCardProps {
  feedback: Feedback;
  totalPoints?: number;
  submission?: Submission;
  student: Student;
  exam: Exam;
  onStudentClick: (student: Student) => void;
  published: ExamPublishState;
}

const ExamSubmissionCard = (props: ExamSubmissionCardProps) => {
  const { t } = useTranslation();
  const isPublished = props.published === ExamPublishState.PUBLISHED;

  return (
    <Card
      color="neutral"
      variant={props.submission || !isPublished ? 'outlined' : 'soft'}
      sx={{
        display: 'flex',
        width: 270,
        justifyContent: 'space-around',
        boxShadow: 'sm',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 50,
              aspectRatio: 1,
              marginRight: 1,
              borderRadius: 'sm',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: props.feedback?.grade
                ? 'success.softBg'
                : 'primary.softBg',
            }}
          >
            {props.feedback?.grade ? (
              <CheckCircleOutlineIcon />
            ) : (
              <PanoramaFishEyeIcon />
            )}
          </Box>
          <Stack>
            <Typography level="h4" sx={{ pb: 0.5 }}>
              {props.student.matriculationNumber}
            </Typography>
            {props.feedback?.grade ? (
              <Chip size="sm" color="success">
                {t('components.testCard.alreadyGraded')}
              </Chip>
            ) : (
              <Chip size="sm" color="primary">
                {t('components.testCard.notGraded')}
              </Chip>
            )}
          </Stack>
        </Box>
        {props.feedback?.grade ? (
          <Button
            size="sm"
            variant="soft"
            disabled={isPublished}
            onClick={() => props.onStudentClick(props.student)}
          >
            {t('components.testCard.editTest')}
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outlined"
            disabled={isPublished}
            onClick={() => props.onStudentClick(props.student)}
          >
            {t('components.testCard.gradeTest')}
          </Button>
        )}
      </Box>
      {props.submission && props.submission.fileUpload.length > 0 && (
        <>
          <Divider inset="none" />
          <Typography sx={{ opacity: '50%' }}>
            {t('components.testCard.files')}
          </Typography>
        </>
      )}
      {props.submission?.fileUpload?.map((file) => (
        <Box
          key={file.fileUuid}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            sx={{
              flex: 1,
              wordBreak: 'break-word',
              paddingRight: 3,
            }}
          >
            {file.filename}
          </Typography>
          <div
            style={{ alignSelf: 'flex-start', cursor: 'pointer' }}
            // TODO: trigger download
            onClick={() => console.log('wow')}
          >
            <DownloadIcon />
          </div>
        </Box>
      ))}
      <Divider inset="none" />
      <Stack>
        <Typography sx={{ opacity: '50%' }}>
          {t('components.testCard.points')}
        </Typography>
        <Typography>
          {(props.feedback?.points ?? 0) + '/' + props.exam.totalPoints}
        </Typography>
        <Typography sx={{ opacity: '50%', paddingTop: 1 }}>
          {t('components.testCard.grade')}
        </Typography>
        <Typography>{props.feedback?.grade ?? 'N/A'}</Typography>
      </Stack>
    </Card>
  );
};

export default ExamSubmissionCard;
