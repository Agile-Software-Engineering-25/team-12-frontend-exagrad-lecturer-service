import ExamsPage from '@/pages/ExamsPage/ExamsPage';
import ExamSubmissionPage from '@/pages/ExamSubmissionPage/ExamSubmissionPage';
import { Route, Routes } from 'react-router';

const RoutingComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<ExamsPage />} />
      <Route path="/submissions/:examUuid" element={<ExamSubmissionPage />} />
    </Routes>
  );
};

export default RoutingComponent;
