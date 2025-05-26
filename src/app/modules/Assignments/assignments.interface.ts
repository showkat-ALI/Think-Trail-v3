import { Types } from 'mongoose';

export type TAssignment = {
  name: string;
  description: string;
  fileUrl: string;
  comment: string;
  score: string;
  availFrom: Date;
  availUntil: Date;
  createdBy: Types.ObjectId;
  submissionAttempts: 'Five attempts' | 'Double attempt' | 'Single attempt';
  isDeleted: boolean;
  submissions?: {
    student: Types.ObjectId;
    assignment: Types.ObjectId;
    course: Types.ObjectId;
  }[];
};
export type TSubmitAssignment={
  submittedBy:Types.ObjectId;
  course:Types.ObjectId;
  assignment:Types.ObjectId;
  fileUrl:string;
  comment:string;
  text:string

  


}