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
  submissions: [
    {
      student: {
        type: Schema.Types.ObjectId,
      },
      assignment: {
        type: Schema.Types.ObjectId,
      },
      course: {
        type: Schema.Types.ObjectId,
      },
    },
  ],

});
const submitAssignmentSchema = new Schema<TSubmitAssignment>({
  submittedBy: {
    type: String
  },
  assignment: {
    type: String,
  },
  comment: {
    type: String,
  },
  course: {
    type:String,
  },
  fileUrl: [{
    fileUrl: String
  }],
  text: {
    type: String,
  },
  tags: {
    type: String, // Array of strings
  },
  mark:{
    type:Number
  },
  grade:{type:String},
  createdBy:{
    type:String
  },
  inscomment:{
    type:String
  }
}, { timestamps: true });

export const Assignment = model<TAssignment>('Assignment', assignmentSchema);
export const SubmitAssignment = model(
  'SubmitAssignment', 
  submitAssignmentSchema
);
