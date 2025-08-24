import useApi from '@hooks/useApi';
import { Typography, Card, Box, Divider } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import type { Exam } from '@/@custom-types/backendTypes';

const ExamCard = () => {
  const { requestExams } = useApi();
  const { t } = useTranslation();
  const [requestedExams, setRequestedExams] = useState<Exam[]>([]);

  const fetchExams = async (lecturer: string) => {
    const exams = await requestExams(lecturer);
    if (exams) {
      setRequestedExams(exams);
    }
  };

  useEffect(() => {
    fetchExams('Tom');
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        justifyContent: 'space-around',
      }}
    >
      {requestedExams.map((exam, index) => (
        <Card
          key={index}
          color="neutral"
          variant="outlined"
          sx={{
            display: 'flex',
            width: 290,
            justifyContent: 'space-around',
            boxShadow: '1px 1px 0px 1px #d3d3d3',
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
                {new Date(exam.date).toLocaleDateString()}
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
              <Typography>{exam.submissions}</Typography>
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default ExamCard;
