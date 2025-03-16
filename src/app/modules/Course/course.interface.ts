import { Types } from 'mongoose';

export type TPreRequisiteCourses = {
  course: Types.ObjectId;
  isDeleted: boolean;
};

export type TCourse = {
  shortDescription: string;
  title: string;
  language: string;
  durationInMinutes: string;
  price: string;
  description: string;
  level: string;
  featured: boolean;
  numberOfLectures: string;
  isDiscount: boolean;
  videoUrl: string;
  isDeleted: boolean;
  fileUrl: string;
  createdBy: Types.ObjectId;
  discountPrice: string;
};

export type TCoursefaculty = {
  course: Types.ObjectId;
  faculties: [Types.ObjectId];
};
