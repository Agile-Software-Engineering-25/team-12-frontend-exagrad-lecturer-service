import type { Exam } from '@/@custom-types/backendTypes';
import Filter from '@/components/Filter/Filter';
import type { RootState } from '@/stores';
import ExamCard from '@components/ExamCard/ExamCard';
import { Box } from '@mui/joy';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
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

  const examWithMetadata = filteredExams.map((exam) => ({
    exam,
    status: getFeedbackStatus(exam.uuid),
    dateTime: new Date(exam.date).getTime(),
  }));

  const sortedExams = examWithMetadata
    .sort((a, b) => {
      const aPriority = statusPriority[a.status] ?? 999;
      const bPriority = statusPriority[b.status] ?? 999;

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      return a.dateTime - b.dateTime;
    })
    .map(({ exam }) => exam);

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
            'partially_graded',
            'submittable',
            'rejected',
            'approved',
            'comming_up',
            'pending_review',
          ]}
          placeholder={t('components.testCard.filter.placeholderStatus')}
          onChange={setSelectedStatuses}
        />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 2,
          pt: 3,
          paddingLeft: 3,
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
