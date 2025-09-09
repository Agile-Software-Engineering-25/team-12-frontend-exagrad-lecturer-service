import ExamsPage from '@/pages/ExamsPage/ExamsPage';
import TestPage from '@/pages/TestPage/TestPage';
import { Route, Routes } from 'react-router';

const RoutingComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<ExamsPage />} />
      <Route path="/submissions/:examUuid" element={<TestPage />} />
    </Routes>
  );
};

export default RoutingComponent;
