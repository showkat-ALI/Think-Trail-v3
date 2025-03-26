import { Schema, model } from 'mongoose';
import { TCourse } from './module.interface';

const courseSchema = new Schema<TCourse>({
  semester: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicSemester',
  },
  program: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicDepartment',
  },
  id: {
    type: String,
  },
  email: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    byDefault: false,
  },
  roles: {
    type: [String], // Assuming Roles[] is an array of strings
    required: true, // Set to true if roles are mandatory
  },
});

export const Admission = model<TCourse>('Admission', courseSchema);
