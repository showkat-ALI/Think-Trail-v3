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
export type TSubmitAssignment = {
  submittedBy: string;
  course: string;
  assignment: string;
  fileUrl: string[];
  comment: string;
  text: string;
  tags: string; // Added an array of strings
  mark:number;
  createdBy:string;
  grade:string;
  inscomment:string
  
};
