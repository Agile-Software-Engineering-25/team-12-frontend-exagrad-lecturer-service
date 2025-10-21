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
    const relevantFeedbacks = Object.entries(feedbacks)
      .filter(([key]) => key.startsWith(`${examUuid}:`))
      .map(([, feedback]) => feedback);

    const exam = exams[examUuid];
    const total = exam.assignedStudents.length;

    const counts = relevantFeedbacks.reduce(
      (acc, feedback) => {
        if (feedback.grade > 0) acc.graded++;

        switch (feedback?.publishStatus) {
          case ExamPublishState.UNPUBLISHED:
            acc.unpublished++;
            break;
          case ExamPublishState.PUBLISHED:
            acc.published++;
            break;
          case ExamPublishState.APPROVED:
            acc.approved++;
            break;
          case ExamPublishState.REJECTED:
            acc.rejected++;
            break;
        }
        return acc;
      },
      { graded: 0, unpublished: 0, published: 0, approved: 0, rejected: 0 }
    );

    if (new Date(exam.date).getTime() > Date.now() && counts.unpublished > 0) {
      return ExamProcess.COMMINGUP;
    }

    if (counts.rejected > 0) {
      return ExamProcess.REJECTED;
    }

    if (counts.approved === total) {
      return ExamProcess.APPROVED;
    }

    if (counts.published === total) {
      return ExamProcess.PENDING;
    }

    if (counts.graded === total && counts.unpublished > 0) {
      return ExamProcess.READY;
    }

    if (counts.graded > 0 && counts.graded < total) {
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
