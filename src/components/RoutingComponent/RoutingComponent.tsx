import ExamsPage from '@/pages/ExamsPage/ExamsPage';
import ExamSubmissionPage from '@/pages/ExamSubmissionPage/ExamSubmissionPage';
import { Route, Routes } from 'react-router';
import SubmissionsPage from '@pages/SubmissionsPage/SubmissionsPage.tsx';
import { useEffect } from 'react';
import useDataLoading from '@hooks/useDataLoading.tsx';

const RoutingComponent = () => {
  const { loadExams, loadFeedback, loadSubmissions } = useDataLoading();
  const lecturerUuid = '12345678-62hj-jhj2-h23j-901234567890';

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
      <Route path="/submissions" element={<SubmissionsPage />} />
      <Route path="/submissions/:examUuid" element={<ExamSubmissionPage />} />
    </Routes>
  );
};

export default RoutingComponent;
