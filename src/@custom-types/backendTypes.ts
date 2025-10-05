import type { ExamType, UserType } from './enums';

interface UserEntity {
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  UserType: UserType;
}

export interface FileReference {
  fileUuid: string;
  filename: string;
  downloadLink: string | null;
}

export interface Student extends UserEntity {
  matriculationNumber: string;
}

export interface Exam {
  uuid: string;
  module: string;
  name: string;
  lecturer: UserEntity;
  totalPoints: number;
  examType: ExamType;
  date: Date;
  time: number;
  allowedResources: string[];
  attempt: number;
  assignedStudents: Student[];
  ects: number;
  room: string;
  fileUploadRequired: boolean;
}

export interface Feedback {
  uuid?: string;
  gradedAt: string;
  examUuid: string;
  lecturerUuid: string;
  studentUuid: string;
  submissionUuid?: string | null;
  comment: string | null;
  fileReference: FileReference[];
  fileUpload?: FileReference[];
  grade: number;
  points: number;
}

export interface Submission {
  id: string;
  examUuid: string;
  studentUuid: string;
  submissionDate: string;
  fileUpload: FileReference[];
}
