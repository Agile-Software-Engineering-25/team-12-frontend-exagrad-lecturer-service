import { Box, Card, Chip, Divider, Typography } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import type { Exam } from '@/@custom-types/backendTypes';
import { useNavigate } from 'react-router-dom';
import i18n from '@/i18n';
import type { ExamGradingState } from '@/@custom-types/enums';

interface ExamCardProps {
  exam: Exam;
  gradeStatus: ExamGradingState;
}

const ExamCard = (props: ExamCardProps) => {
  const { exam } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();

  const route = () => {
    if (!exam.fileUploadRequired) {
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
        boxShadow: 'sm',
        transition: 'all ease .3s',
        cursor: 'pointer',
        ':hover': {
          transform: 'scale(1.03)',
          boxShadow: 'lg',
        },
      }}
    >
      <Typography level="h4" lineHeight={1.2}>
        {exam.name}
      </Typography>
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
          <Typography sx={{ fontSize: 'md' }}>{exam.module}</Typography>
        </Box>
        <Box>
          <Typography sx={{ opacity: '50%' }}>
            {t('pages.exam.date')}
          </Typography>
          <Typography>
            {new Date(exam.date).toLocaleDateString(i18n.language)}
          </Typography>
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
          <Typography>{exam.time / 60}</Typography>
        </Box>
        <Box>
          <Typography sx={{ opacity: '50%' }}>
            {t('pages.exam.exams')}
          </Typography>
          <Typography>
            {exam.assignedStudents?.length ?? 'Loading...'}
          </Typography>
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
            {t('pages.exam.type')}
          </Typography>
          <Typography>
            {t(`components.testCard.examTypes.${exam.examType}`)}
          </Typography>
        </Box>
        <Box>
          <Chip
            color={
              props.gradeStatus == 'graded'
                ? 'success'
                : props.gradeStatus == 'ungraded'
                  ? 'warning'
                  : 'primary'
            }
          >
            {t('components.testCard.gradeStatus.' + props.gradeStatus)}
          </Chip>
        </Box>
      </Box>
    </Card>
  );
};

export default ExamCard;
