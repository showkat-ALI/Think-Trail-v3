import { Schema, model } from 'mongoose';
import { TAssignment, TSubmitAssignment } from './assignments.interface';
const SUBMISSION_ATTEMPTS = [
  'Five-attempts',
  'double-attempt',
  'single-attempt',
];

const assignmentSchema = new Schema<TAssignment>({
  name: {
    type: String,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  fileUrl: {
    type: String,
  },
  submissionAttempts: {
    type: String,
    enum: SUBMISSION_ATTEMPTS,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
  },
  score: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  comment: {
    type: String,
  },
  availFrom: {
    type: Date,
  },
  availUntil: {
    type: Date,
  },
});
const submitAssignmentSchema =new Schema <TSubmitAssignment>({
  student:{
    type:Schema.Types.ObjectId,

  },
  assignment: {
    type: Schema.Types.ObjectId
  },
  comment:{
    type:String
  },
  course:{
    type:Schema.Types.ObjectId
  },
  fileUrl:{
    type: String
  },
  text:{
    type:String
  }
})

export const Assignment = model<TAssignment>('Assignment', assignmentSchema);
export const SubmitAssignment = model<TSubmitAssignment>('SubmitAssignment', submitAssignmentSchema);
