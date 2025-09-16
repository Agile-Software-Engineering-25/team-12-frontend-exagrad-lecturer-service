import ExamsPage from '@/pages/ExamsPage/ExamsPage';
import { Route, Routes } from 'react-router';
import SubmissionsPage from '@pages/SubmissionsPage/SubmissionsPage.tsx';

const RoutingComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<ExamsPage />} />
      <Route path="/submissions" element={<SubmissionsPage />} />
    </Routes>
  );
};

export default RoutingComponent;
