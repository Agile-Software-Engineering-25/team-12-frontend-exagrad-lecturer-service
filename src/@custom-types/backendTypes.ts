import { UserType } from './enums';

export interface UserEntity {
  id: string;
  first_name: string;
  last_name: string;
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
