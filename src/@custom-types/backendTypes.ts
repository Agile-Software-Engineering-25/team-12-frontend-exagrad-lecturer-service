import type { UserType } from './enums';

export interface UserEntity {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  UserType: UserType;
}

export interface Exam {
  uuid: string;
  module: string;
  name: string;
  lecturer: UserEntity;
  grade: number | null;
  average: number | null;
  totalPoints: number;
  achievedPoints: number | null;
  examType: string;
  date: Date;
  time: number;
  allowedResources: string[];
  attempt: number;
  student: UserEntity;
  ects: number;
  room: string;
  submissionsCount: number;
}

export enum Status {
  submitted,
  rejected,
}

export interface ExamSubmission {
  submissionId: string;
  examId: string;
  studentId: string;
  submissionDate: Date;
  fileUrl: string[];
  status: Status;
  examOfficeComment: string;
  grade: number;
  gradeDocumentUrl: string;
  graderId: string; //UUID of lecturer who graded the submission
  gradingDate: Date;
}
