import { ExamPublishState } from '@/@custom-types/enums';
import { useTypedSelector } from '@/stores/rootReducer';
import { setFeedback } from '@/stores/slices/feedbackSlice';
import { useDispatch } from 'react-redux';
import { ExamProcess } from '@/@custom-types/enums';

const usePublishStatus = () => {
  const feedbacks = useTypedSelector((state) => state.feedback.data);
  const exams = useTypedSelector((state) => state.exam.data);
  const dispatch = useDispatch();

  const getFeedbackStatus = (examUuid: string): ExamProcess => {
    const entries = Object.entries(feedbacks);
    const relevantFeedbacks = entries
      .filter(([key]) => key.startsWith(`${examUuid}:`))
      .map(([, feedback]) => feedback);

    const exam = exams[examUuid];
    const total = exam.assignedStudents.length;

    const graded = relevantFeedbacks.filter(
      (fb) => typeof fb?.grade === 'number' && fb.grade > 0
    );
    const unpublished = relevantFeedbacks.filter(
      (fb) => fb?.publishStatus == ExamPublishState.UNPUBLISHED
    );
    const published = relevantFeedbacks.filter(
      (fb) => fb?.publishStatus === ExamPublishState.PUBLISHED
    );
    const approved = relevantFeedbacks.filter(
      (fb) => fb?.publishStatus === ExamPublishState.APPROVED
    );
    const rejected = relevantFeedbacks.filter(
      (fb) => fb?.publishStatus === ExamPublishState.REJECTED
    );

    if (new Date(exam.date).getTime() > Date.now() && unpublished) {
      return ExamProcess.COMMINGUP;
    }

    if (rejected.length > 0) {
      return ExamProcess.REJECTED;
    }

    if (approved.length === total) {
      return ExamProcess.APPROVED;
    }

    if (published.length === total) {
      return ExamProcess.PENDING;
    }

    if (graded.length === total && unpublished) {
      return ExamProcess.READY;
    }

    if (graded.length > 0 && graded.length < total) {
      return ExamProcess.PARTIALLY;
    }

    return ExamProcess.OPEN;
  };

  const findFeedbackByStatus = (
    examUuid: string,
    publishStatus: ExamPublishState
  ): boolean => {
    const entries = Object.entries(feedbacks);

    const relevantFeedbacks = entries.filter(([key]) =>
      key.startsWith(`${examUuid}:`)
    );

    if (relevantFeedbacks.length === 0) return false;

    return relevantFeedbacks.every(
      ([, feedback]) => feedback.publishStatus === publishStatus
    );
  };

  const setFeedbackStatus = (
    examUuid: string,
    publishStatus: ExamPublishState
  ): void => {
    const updatedFeedbacks = Object.fromEntries(
      Object.entries(feedbacks).map(([key, feedback]) => {
        if (key.startsWith(`${examUuid}:`)) {
          return [key, { ...feedback, publishStatus: publishStatus }];
        }
        return [key, feedback];
      })
    );

    const updatedFeedbackList = Object.values(updatedFeedbacks);
    dispatch(setFeedback(updatedFeedbackList));
  };

  const statusPriority: Record<string, number> = {
    open: 0,
    partially: 1,
    ready: 2,
    pending: 3,
    rejected: 4,
    comming_up: 5,
    approved: 6,
  };

  return {
    findFeedbackByStatus,
    setFeedbackStatus,
    getFeedbackStatus,
    statusPriority,
  };
};

export default usePublishStatus;
