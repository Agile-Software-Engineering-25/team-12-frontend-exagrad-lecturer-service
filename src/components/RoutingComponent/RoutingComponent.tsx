import Home from '@pages/Home/Home';
import Exams from '@pages/Exams/Exams';
import { Route, Routes } from 'react-router';

const RoutingComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/exams" element={<Exams />} />
    </Routes>
  );
};

export default RoutingComponent;
