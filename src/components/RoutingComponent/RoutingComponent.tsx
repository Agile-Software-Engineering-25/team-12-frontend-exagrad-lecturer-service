import ExamsPage from '@/pages/ExamsPage/ExamsPage';
import ExamSubmissionPage from '@/pages/ExamSubmissionPage/ExamSubmissionPage';
import { Route, Routes } from 'react-router';
import { useEffect } from 'react';
import useDataLoading from '@hooks/useDataLoading.tsx';
import { useUser } from '@hooks/useUser';

const RoutingComponent = () => {
  const { getUserId } = useUser();
  const { loadExams, loadFeedback, loadSubmissions } = useDataLoading();
  const lecturerUuid = getUserId() || 'fc6ac29a-b9dd-4b35-889f-2baff71f3be1';

  useEffect(() => {
    const load = async () => {
      await loadExams(lecturerUuid);
      await loadFeedback(lecturerUuid);
      await loadSubmissions(lecturerUuid);
    };
    load();
  }, [loadExams, loadFeedback, loadSubmissions]);

  return (
    <Routes>
      <Route path="/" element={<ExamsPage />} />
      <Route path="/submissions/:examUuid" element={<ExamSubmissionPage />} />
    </Routes>
  );
};

export default RoutingComponent;
