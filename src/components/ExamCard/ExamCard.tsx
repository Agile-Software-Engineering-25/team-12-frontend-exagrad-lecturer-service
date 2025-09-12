import { Typography, Card, Box, Divider, Chip } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import type { Exam, Grade } from '@/@custom-types/backendTypes';
import { ExamType } from '@/@custom-types/enums';
import { useNavigate } from 'react-router-dom';
import useApi from '@/hooks/useApi';
import { useEffect, useState } from 'react';
import { setGrade } from '@/stores/slices/gradeSlice';
import { useDispatch } from 'react-redux';

interface ExamCardProps {
  exam: Exam;
}

const ExamCard = (props: ExamCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [gradeStatus, setGradeStatus] = useState<
    'graded' | 'partial' | 'ungraded'
  >();
  const { requestGrade } = useApi();
  const { exam } = props;
  const formatForDisplay = (type: ExamType): string => {
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  const route = () => {
    const examWithoutSubmissions = [
      ExamType.PRESENTATION,
      ExamType.EXAM,
      ExamType.ORAL,
    ];
    if (examWithoutSubmissions.includes(exam.examType)) {
      navigate(`/submissions/${exam.uuid}`);
    }
  };

  useEffect(() => {
    const fetchGrades = async () => {
      const gradePromises = exam.assignedStudents.map((student) =>
        requestGrade(exam.uuid, student.uuid)
      );

      const results = await Promise.all(gradePromises);
      const grades = results.filter((grade): grade is Grade => Boolean(grade));
      if (grades.length > 0) {
        dispatch(setGrade(grades));
      }

      if (results.length === grades.length) {
        setGradeStatus('graded');
      } else if (grades.length == 0) {
        setGradeStatus('ungraded');
      } else {
        setGradeStatus('partial');
      }
    };
    fetchGrades();
  }, [exam, dispatch]);

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
          <Typography>
            {new Date(exam.date).toLocaleDateString('de-DE')}
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
          <Typography>{exam.time}</Typography>
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
          <Typography>{formatForDisplay(exam.examType)}</Typography>
        </Box>
        <Box>
          {gradeStatus === 'graded' && (
            <Chip color="success">
              {t('components.testCard.gradeStatus.graded')}
            </Chip>
          )}
          {gradeStatus === 'ungraded' && (
            <Chip color="warning">
              {t('components.testCard.gradeStatus.ungraded')}
            </Chip>
          )}
          {gradeStatus === 'partial' && (
            <Chip color="primary">
              {t('components.testCard.gradeStatus.partial')}
            </Chip>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default ExamCard;
