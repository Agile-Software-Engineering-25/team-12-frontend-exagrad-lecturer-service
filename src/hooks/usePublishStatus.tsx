import { ExamStatus, FeedbackPublishStatus } from '@/@custom-types/enums';
import { useTypedSelector } from '@/stores/rootReducer';
import { setFeedback } from '@/stores/slices/feedbackSlice';
import { useDispatch } from 'react-redux';

const usePublishStatus = () => {
  const feedbacks = useTypedSelector((state) => state.feedback.data);
  const exams = useTypedSelector((state) => state.exam.data);
  const dispatch = useDispatch();

  const getFeedbackStatus = (examUuid: string): ExamStatus => {
    const relevantFeedbacks = Object.entries(feedbacks)
      .filter(([key]) => key.startsWith(`${examUuid}:`))
      .map(([, feedback]) => feedback);

    const exam = exams[examUuid];
    const total = exam.assignedStudents.length;

    const counts = relevantFeedbacks.reduce(
      (acc, feedback) => {
        if (feedback.grade > 0) acc.graded++;

        switch (feedback?.publishStatus) {
          case FeedbackPublishStatus.UNPUBLISHED:
            acc.unpublished++;
            break;
          case FeedbackPublishStatus.PUBLISHED:
            acc.published++;
            break;
          case FeedbackPublishStatus.APPROVED:
            acc.approved++;
            break;
          case FeedbackPublishStatus.REJECTED:
            acc.rejected++;
            break;
        }
        return acc;
      },
      { graded: 0, unpublished: 0, published: 0, approved: 0, rejected: 0 }
    );

    if (new Date(exam.date).getTime() > Date.now() && counts.unpublished >= 0) {
      return ExamStatus.COMMING_UP;
    }

    if (counts.rejected > 0) {
      return ExamStatus.REJECTED;
    }

    if (counts.approved === total) {
      return ExamStatus.APPROVED;
    }

    if (counts.published === total) {
      return ExamStatus.PENDING_REVIEW;
    }

    if (counts.graded === total && counts.unpublished > 0) {
      return ExamStatus.SUBMITTABLE;
    }

    if (counts.graded > 0 && counts.graded < total) {
      return ExamStatus.PARTIALLY_GRADED;
    }

    return ExamStatus.OPEN;
  };

  const findFeedbackByStatus = (
    examUuid: string,
    publishStatus: FeedbackPublishStatus
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
    publishStatus: FeedbackPublishStatus
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
    partially_graded: 1,
    submittable: 2,
    pending_review: 3,
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
