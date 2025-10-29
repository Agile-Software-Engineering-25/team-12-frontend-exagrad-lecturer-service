export enum UserType {
  LECTURER = 'LECTURER',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
}

export enum ExamType {
  EXAM = 'EXAM',
  PRESENTATION = 'PRESENTATION',
  ORAL = 'ORAL',
  PROJECT = 'PROJECT',
  OTHERS = 'OTHERS',
}

export enum GradingStatus {
  GRADED = 'graded',
  UNGRADED = 'ungraded',
  PARTIALLY_GRADED = 'partially_graded',
}

export enum ExamStatus {
  COMING_UP = 'coming_up',
  OPEN = 'open',
  PARTIALLY_GRADED = 'partially_graded',
  SUBMITTABLE = 'submittable',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum FeedbackPublishStatus {
  UNPUBLISHED = 'UNPUBLISHED',
  PUBLISHED = 'PUBLISHED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
