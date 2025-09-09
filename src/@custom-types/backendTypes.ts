import type { ExamType, UserType } from './enums';

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
  examType: ExamType;
  date: Date;
  time: number;
  allowedResources: string[];
  attempt: number;
  student: UserEntity;
  ects: number;
  room: string;
  submissionsCount: number;
}

export interface Submission {
  uuid: string;
  studentUuid: string[];
  totalPoints: number;
}

export interface Grade {
  grade: number;
  points: number;
}
