import { Types } from 'mongoose';

export type TPreRequisiteCourses = {
  course: Types.ObjectId;
  isDeleted: boolean;
};

export type TModuleVideo = {
  module: Types.ObjectId;
  key: string;
  localVideo: string;
  minutes: string;
  second: string;
  topicName: string;
  youtubeVide?: string;
};
export type TModuleAssignment = {
  module: Types.ObjectId;
  assignment: Types.ObjectId;
};
export type TCoursefaculty = {
  course: Types.ObjectId;
  faculties: [Types.ObjectId];
};
