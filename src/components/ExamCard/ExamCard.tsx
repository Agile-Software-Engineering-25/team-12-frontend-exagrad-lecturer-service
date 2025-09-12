import { Typography, Card, Box, Divider, Chip } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import type { Exam, Feedback } from '@/@custom-types/backendTypes';
import { ExamType } from '@/@custom-types/enums';
import { useNavigate } from 'react-router-dom';
import useApi from '@/hooks/useApi';
import { useEffect, useMemo, useState } from 'react';
import { setGrades } from '@/stores/slices/gradeSlice';
import { useDispatch } from 'react-redux';

interface ExamCardProps {
  exam: Exam;
}

const ExamCard = (props: ExamCardProps) => {
  const { exam } = props;
  const { requestGrade } = useApi();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [examGrades, setExamGrades] = useState<Feedback[]>([]);

  i18n.language;

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

  const gradeStatus = useMemo(() => {
    const totalStudents = exam.assignedStudents.length;
    const gradeCount = examGrades.length;

    if (gradeCount === 0) {
      return 'ungraded';
    }
    if (gradeCount === totalStudents) {
      return 'graded';
    }
    return 'partial';
  }, [examGrades.length, exam.assignedStudents.length]);

  useEffect(() => {
    const studentUuids = exam.assignedStudents.map((student) => student.uuid);
    loadGradesForExam(exam.uuid, studentUuids);
  }, [exam.uuid, exam.assignedStudents, loadGradesForExam]);

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
              gradeStatus == 'graded'
                ? 'success'
                : gradeStatus == 'ungraded'
                  ? 'warning'
                  : 'primary'
            }
          >
            {t('components.testCard.gradeStatus.' + gradeStatus)}
          </Chip>
        </Box>
      </Box>
    </Card>
  );
};

export default ExamCard;
function loadGradesForExam(uuid: string, studentUuids: string[]) {
  throw new Error('Function not implemented.');
}
