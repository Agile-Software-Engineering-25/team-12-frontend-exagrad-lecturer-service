import TestCard from '@/components/TestCard/TestCard';
import { Box } from '@mui/joy';
import { useParams } from 'react-router-dom';

const TestPage = () => {
  const { examUuid } = useParams();
  return (
    <>
      <TestCard examUuid={examUuid!}></TestCard>
    </>
  );
};

export default TestPage;
