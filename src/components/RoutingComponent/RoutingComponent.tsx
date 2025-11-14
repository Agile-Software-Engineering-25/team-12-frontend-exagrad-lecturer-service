import ExamsPage from '@/pages/ExamsPage/ExamsPage';
import ExamSubmissionPage from '@/pages/ExamSubmissionPage/ExamSubmissionPage';
import { Route, Routes } from 'react-router';
import { useEffect } from 'react';
import useDataLoading from '@hooks/useDataLoading.tsx';
import { useUser } from '@hooks/useUser';
import LoadingSpinner from '@components/LoadingSpinner/LoadingSpinner.tsx';
import { useTypedSelector } from '@stores/rootReducer.ts';

const RoutingComponent = () => {
  const { getUserId } = useUser();
  const { loadExams, loadFeedback, loadSubmissions } = useDataLoading();
  const lecturerUuid = getUserId() || '5a9cee80-7f1e-4bfb-8d4a-218128b3550f';

  const examState = useTypedSelector((state) => state.exam.state);
  const feedbackState = useTypedSelector((state) => state.feedback.state);
  const submissionState = useTypedSelector((state) => state.submission.state);

  const isLoading =
    examState === 'loading' ||
    feedbackState === 'loading' ||
    submissionState === 'loading';

  useEffect(() => {
    const load = () => {
      loadExams(lecturerUuid);
      loadFeedback(lecturerUuid);
      loadSubmissions(lecturerUuid);
    };
    load();
  }, [loadExams, loadFeedback, loadSubmissions]);

  if (isLoading) {
    return <LoadingSpinner message="Loading exams and submissions..." />;
  }

  return (
    <Routes>
      <Route path="/" element={<ExamsPage />} />
      <Route path="/submissions/:examUuid" element={<ExamSubmissionPage />} />
    </Routes>
  );
};

export default RoutingComponent;
