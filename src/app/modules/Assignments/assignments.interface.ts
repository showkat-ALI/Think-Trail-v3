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
};
export type TSubmitAssignment={
  student:Types.ObjectId;
  course:Types.ObjectId;
  assignment:Types.ObjectId;
  fileUrl:string;
  comment:string;
  text:string


}