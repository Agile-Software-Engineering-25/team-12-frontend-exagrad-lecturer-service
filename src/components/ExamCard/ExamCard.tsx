import { Typography, Card, Box, Divider } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import type { Exam } from '@/@custom-types/backendTypes';
import { ExamType } from '@/@custom-types/enums';
import { useNavigate } from 'react-router-dom';

interface ExamCardProps {
  exam: Exam;
}

// Calculate the submissionsCount later with a different API call.
const ExamCard = (props: ExamCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { exam } = props;

  const formatForDisplay = (type: ExamType): string => {
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  const route = () => {
    if (exam.examType === ExamType.PRESENTATION) {
      navigate(`/submissions/${exam.uuid}`);
    }
  };

  return (
    <Card
      onClick={route}
      color="neutral"
      variant="outlined"
      sx={{
        display: 'flex',
        width: 270,
        justifyContent: 'space-around',
        boxShadow: '1px 1px 0px 1px #d3d3d3',
        ':hover': {
          transform: 'scale(1.03)',
          boxShadow: 'lg',
        },
      }}
    >
      <Typography level="h3">{exam.name}</Typography>
      <Divider inset="none" />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography sx={{ opacity: '50%' }}>
            {t('pages.exam.module')}
          </Typography>
          <Typography level="h3" sx={{ fontSize: 'lg' }}>
            {exam.module}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ opacity: '50%' }}>
            {t('pages.exam.date')}
          </Typography>
          <Typography>{new Date(exam.date).toLocaleDateString()}</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography sx={{ opacity: '50%' }}>
            {t('pages.exam.time')}
          </Typography>
          <Typography>{exam.time}</Typography>
        </Box>
        <Box>
          <Typography sx={{ opacity: '50%' }}>
            {t('pages.exam.exams')}
          </Typography>
          <Typography>{exam.submissionsCount}</Typography>
        </Box>
      </Box>
      <Box>
        <Typography sx={{ opacity: '50%' }}>{t('pages.exam.type')}</Typography>
        <Typography>{formatForDisplay(exam.examType)}</Typography>
      </Box>
    </Card>
  );
};

export default ExamCard;
