import { Types } from 'mongoose';
import { Roles } from '../user/user.interface';

export type TPreRequisiteCourses = {
  course: Types.ObjectId;
  isDeleted: boolean;
};

export type TCourse = {
  semester: Types.ObjectId;
  program: Types.ObjectId;
  agreeTerms: boolean;
  email: string;
  id: Types.ObjectId;
  roles: Roles[];
  isDeleted: boolean;
  status: string;
};

export type TCoursefaculty = {
  course: Types.ObjectId;
  faculties: [Types.ObjectId];
};
