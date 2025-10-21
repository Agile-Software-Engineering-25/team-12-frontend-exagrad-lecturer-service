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

export enum ExamGradingState {
  GRADED = 'graded',
  UNGRADED = 'ungraded',
  PARTIALLY = 'partial',
}

export enum ExamProcess {
  COMMINGUP = 'comming_up',
  OPEN = 'open',
  PARTIALLY = 'partially',
  READY = 'ready',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum ExamPublishState {
  UNPUBLISHED = 'UNPUBLISHED',
  PUBLISHED = 'PUBLISHED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
