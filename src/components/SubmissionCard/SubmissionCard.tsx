import { Box, Button, Card, Chip, Divider, Stack, Typography } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import DownloadIcon from '@mui/icons-material/Download';

interface SubmissionCardProps {
  grade?: number;
  matriculationNumber: string;
  // TODO: fileUrl = file name?
  fileUrl: string[];
}

const SubmissionCard = (props: SubmissionCardProps) => {
  const { t } = useTranslation();

  return (
    <Card
      color="neutral"
      variant="outlined"
      sx={{
        display: 'flex',
        width: 270,
        margin: 1,
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
              backgroundColor: props.grade
                ? 'success.softBg'
                : 'primary.softBg',
            }}
          >
            {props.grade ? <CheckCircleOutlineIcon /> : <PanoramaFishEyeIcon />}
          </Box>
          <Stack>
            <Typography level="h4">{props.matriculationNumber}</Typography>
            {props.grade ? (
              <Chip size="sm" color="success">
                {t('components.SubmissionCard.graded')}
              </Chip>
            ) : (
              <Chip size="sm" color="primary">
                {t('components.SubmissionCard.notGraded')}
              </Chip>
            )}
          </Stack>
        </Box>
        <Button size="sm">
          {props.grade
            ? t('components.SubmissionCard.edit')
            : t('components.SubmissionCard.grade')}
        </Button>
      </Box>
      <Divider inset="none" />
      <Stack>
        <Typography sx={{ opacity: '50%' }}>
          {t('components.SubmissionCard.files')}
        </Typography>
        {props.fileUrl.map((file, index) => {
          /* skip rejected files -> might want to display them regardless?
          if (props.status == Status.rejected) {
            return;
          }*/
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingY: 1,
              }}
            >
              <Typography
                sx={{
                  flex: 1,
                  wordBreak: 'break-word',
                  paddingRight: 3,
                }}
              >
                {file}
              </Typography>
              <div
                style={{ alignSelf: 'flex-start', cursor: 'pointer' }}
                // TODO: trigger download
                onClick={() => console.log('wow')}
              >
                <DownloadIcon />
              </div>
            </Box>
          );
        })}
      </Stack>
      <Divider />
      <Stack>
        <Typography sx={{ opacity: '50%' }}>
          {t('components.SubmissionCard.achievedGrade')}
        </Typography>
        <Typography>{props.grade ?? 'N/A'}</Typography>
      </Stack>
    </Card>
  );
};

export default SubmissionCard;
