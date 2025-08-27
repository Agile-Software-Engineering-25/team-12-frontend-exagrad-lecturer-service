import ExamsPage from '@/pages/ExamsPage/ExamsPage';
import { Route, Routes } from 'react-router';

const RoutingComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<ExamsPage />} />
    </Routes>
  );
};

export default RoutingComponent;
