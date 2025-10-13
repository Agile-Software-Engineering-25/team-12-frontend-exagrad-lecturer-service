import type { Exam } from '@/@custom-types/backendTypes';
import Filter from '@/components/ExamCard/Filter';
import type { RootState } from '@/stores';
import ExamCard from '@components/ExamCard/ExamCard';
import { Box } from '@mui/joy';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const ExamsPage = () => {
  const { t } = useTranslation();
  const requestedExams = useSelector((state: RootState) => state.exam.data);
  const exams = Object.values(requestedExams);

  const allGrades = useSelector(
    (state: RootState) => state.feedback.data || []
  );

  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const gradeStatus = (exam: Exam) => {
    const examGrades = Object.values(allGrades).filter(
      (grade) => grade.examUuid === exam.uuid
    );

    const totalStudents = exam.assignedStudents.length;
    const gradeCount = examGrades.length;

    if (gradeCount === 0) {
      return 'ungraded';
    }
    if (gradeCount === totalStudents) {
      return 'graded';
    }
    return 'partial';
  };

  const filteredExams = exams.filter((exam) => {
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
          customList={['graded', 'partial', 'ungraded']}
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
        {filteredExams.map((exam) => {
          const status = gradeStatus(exam);
          return <ExamCard exam={exam} gradeStatus={status} key={exam.uuid} />;
        })}
      </Box>
    </>
  );
};

export default ExamsPage;
