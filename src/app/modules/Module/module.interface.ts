import { Types } from 'mongoose';

export type TPreRequisiteCourses = {
  course: Types.ObjectId;
  isDeleted: boolean;
};

export type TCourse = {
  name: string;
  course: Types.ObjectId;
  slides: Types.ObjectId;
  videos: Types.ObjectId;
  quizzes: Types.ObjectId;
  isDeleted:boolean
};

export type TCoursefaculty = {
  course: Types.ObjectId;
  faculties: [Types.ObjectId];
};
