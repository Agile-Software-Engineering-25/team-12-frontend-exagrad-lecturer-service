import { Box, Card, Chip, Divider, Typography } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import type { Exam } from '@/@custom-types/backendTypes';
import { useNavigate } from 'react-router-dom';
import i18n from '@/i18n';
import { ExamStatus } from '@/@custom-types/enums';
import { useEffect, useState } from 'react';

interface ExamCardProps {
  exam: Exam;
  gradeStatus: ExamStatus;
}

const ExamCard = (props: ExamCardProps) => {
  const { exam } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (
      props.gradeStatus == ExamStatus.APPROVED ||
      props.gradeStatus == ExamStatus.COMING_UP
    ) {
      setIsValid(false);
    }
  }, [props.gradeStatus]);

  const route = () => {
    if (isValid) {
      navigate(`/submissions/${exam.uuid}`);
    }
  };

  return (
    <Card
      onClick={route}
      color="neutral"
      variant={isValid ? 'outlined' : 'soft'}
      sx={{
        display: 'flex',
        width: 270,
        justifyContent: 'space-around',
        boxShadow: 'sm',
        transition: 'all ease .3s',
        ...(isValid && {
          cursor: 'pointer',
          ':hover': {
            transform: 'scale(1.03)',
            boxShadow: 'lg',
          },
        }),
      }}
    >
      <Typography
        level="h4"
        lineHeight={1.2}
        sx={{
          overflowWrap: 'anywhere',
        }}
      >
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
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ opacity: '50%' }}>
            {t('pages.exam.date')}
          </Typography>
          <Typography>
            {new Date(exam.date).toLocaleDateString(i18n.language, {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
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
              props.gradeStatus == 'open' ||
              props.gradeStatus == 'partially_graded' ||
              props.gradeStatus == 'approved'
                ? 'success'
                : props.gradeStatus == 'submittable'
                  ? 'primary'
                  : props.gradeStatus == 'pending_review' ||
                      props.gradeStatus == 'coming_up'
                    ? 'warning'
                    : 'danger'
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
