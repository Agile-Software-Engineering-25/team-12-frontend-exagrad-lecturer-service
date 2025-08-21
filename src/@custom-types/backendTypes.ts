import { UserType } from './enums';

export interface UserEntity {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  type: UserType;
}

export interface Exam {
  id: string;
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
  count: number;
  semester: string;
}
