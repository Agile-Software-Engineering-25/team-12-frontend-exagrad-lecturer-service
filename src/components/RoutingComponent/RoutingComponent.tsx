import Exams from '@pages/Exams/Exams';
import { Route, Routes } from 'react-router';

const RoutingComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Exams />} />
    </Routes>
  );
};

export default RoutingComponent;
