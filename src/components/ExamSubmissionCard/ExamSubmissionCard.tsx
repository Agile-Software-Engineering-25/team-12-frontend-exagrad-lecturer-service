import { Box, Button, Card, Chip, Divider, Stack, Typography } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import type { Feedback } from '@/@custom-types/backendTypes';

interface ExamSubmissionCradProps {
  feedback: Feedback;
  totalpoints?: number;
  matriculationNumber: string;
}
const ExamSubmissionCard = (props: ExamSubmissionCradProps) => {
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
              width: 40,
              height: 40,
              marginRight: 1,
              borderRadius: 'sm',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: props.feedback.grade
                ? 'success.softBg'
                : 'primary.softBg',
            }}
          >
            {props.feedback.grade ? (
              <CheckCircleOutlineIcon />
            ) : (
              <PanoramaFishEyeIcon />
            )}
          </Box>
          <Stack>
            <Typography level="h4">{props.matriculationNumber}</Typography>
            {props.feedback.grade ? (
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
        {props.feedback.grade ? (
          <Button size="sm">{t('components.testCard.gradeTest')}</Button>
        ) : (
          <Button size="sm" variant="outlined">
            {t('components.testCard.editTest')}
          </Button>
        )}
      </Box>
      <Divider inset="none" />
      <Stack>
        <Typography sx={{ opacity: '50%' }}>
          {t('components.testCard.points')}
        </Typography>
        <Typography>
          {(props.feedback.points ?? 0) + '/' + props.totalpoints}
        </Typography>
        <Typography sx={{ opacity: '50%' }}>
          {t('components.testCard.grade')}
        </Typography>
        <Typography>{props.feedback.grade ?? 'N/A'}</Typography>
      </Stack>
    </Card>
  );
};

export default ExamSubmissionCard;
