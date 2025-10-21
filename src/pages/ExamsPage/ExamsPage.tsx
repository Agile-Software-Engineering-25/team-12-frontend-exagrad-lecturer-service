import type { Exam } from '@/@custom-types/backendTypes';
import Filter from '@/components/Filter/Filter';
import type { RootState } from '@/stores';
import ExamCard from '@components/ExamCard/ExamCard';
import { Box } from '@mui/joy';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ExamPublishState } from '@/@custom-types/enums';
import usePublishStatus from '@/hooks/usePublishStatus';

const ExamsPage = () => {
  const { t } = useTranslation();
  const { statusPriority, getFeedbackStatus } = usePublishStatus();
  const requestedExams = useSelector((state: RootState) => state.exam.data);
  const exams = Object.values(requestedExams);

  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const gradeStatus = (exam: Exam) => {
    return getFeedbackStatus(exam.uuid);
  };

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const status = gradeStatus(exam);

      const matchesModule =
        selectedModules.length === 0 || selectedModules.includes(exam.module);
      const matchesTime =
        selectedTimes.length === 0 || selectedTimes.includes(String(exam.time));
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(exam.examType);
      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(status);

      return matchesModule && matchesTime && matchesType && matchesStatus;
    });
  }, [
    exams,
    selectedModules,
    selectedTimes,
    selectedTypes,
    selectedStatuses,
    gradeStatus,
  ]);

  const sortedExams = [...filteredExams].sort((a, b) => {
    const aStatus = getFeedbackStatus(a.uuid);
    const bStatus = getFeedbackStatus(b.uuid);

    const aPriority = statusPriority[aStatus] ?? 999;
    const bPriority = statusPriority[bStatus] ?? 999;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    const aDate = new Date(a.date).getTime();
    const bDate = new Date(b.date).getTime();

    return aDate - bDate;
  });

  return (
    <>
      <Box display={'flex'} justifyContent={'end'} gap={2} paddingInline={2}>
        <Filter
          label={t('components.testCard.filter.labelModul')}
          listObject={exams}
          filterThis="module"
          placeholder={t('components.testCard.filter.placeholderModul')}
          onChange={setSelectedModules}
        />

        <Filter
          label={t('components.testCard.filter.labelTime')}
          listObject={exams}
          filterThis="time"
          placeholder={t('components.testCard.filter.placeholderTime')}
          onChange={(value) => setSelectedTimes(value.map(String))}
        />

        <Filter
          label={t('components.testCard.filter.labelType')}
          listObject={exams}
          filterThis="examType"
          placeholder={t('components.testCard.filter.placeholderType')}
          onChange={setSelectedTypes}
        />

        <Filter
          label={t('components.testCard.filter.labelStatus')}
          customList={[
            'open',
            'partially',
            'ready',
            'rejected',
            'approved',
            'comming_up',
            'pending',
          ]}
          placeholder={t('components.testCard.filter.placeholderStatus')}
          onChange={setSelectedStatuses}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          paddingTop: 3,
          justifyContent: 'space-around',
        }}
      >
        {sortedExams.map((exam) => {
          const status = gradeStatus(exam);

          return <ExamCard exam={exam} gradeStatus={status} key={exam.uuid} />;
        })}
      </Box>
    </>
  );
};

export default ExamsPage;
