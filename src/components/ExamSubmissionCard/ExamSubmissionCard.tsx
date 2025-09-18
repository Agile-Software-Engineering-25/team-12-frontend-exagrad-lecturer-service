import { Box, Button, Card, Chip, Divider, Stack, Typography } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import DownloadIcon from '@mui/icons-material/Download';
import type { Feedback, FileReference } from '@/@custom-types/backendTypes';

interface ExamSubmissionCardProps {
  feedback: Feedback;
  totalPoints?: number;
  matriculationNumber: string;
  files?: FileReference[];
}

const ExamSubmissionCard = (props: ExamSubmissionCardProps) => {
  const { t } = useTranslation();

  return (
    <Card
      color="neutral"
      variant="outlined"
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
              {props.matriculationNumber}
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
          <Button size="sm">{t('components.testCard.gradeTest')}</Button>
        ) : (
          <Button size="sm" variant="outlined">
            {t('components.testCard.editTest')}
          </Button>
        )}
      </Box>
      {props.files && props.files.length > 0 && (
        <>
          <Divider inset="none" />
          <Typography sx={{ opacity: '50%' }}>
            {t('components.testCard.files')}
          </Typography>
        </>
      )}
      {props.files?.map((file) => (
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
          {(props.feedback?.points ?? 0) + '/' + props.totalPoints}
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
