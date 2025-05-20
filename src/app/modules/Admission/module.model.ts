import { Schema, model } from 'mongoose';
import { TCourse } from './module.interface';

const courseSchema = new Schema<TCourse>({
 program: { type: Schema.Types.ObjectId, ref: 'AcademicDepartment' },
  semester: { type: Schema.Types.ObjectId, ref: 'AcademicSemester' },
  id: {
    type:String,
    
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
  status:{ type: String}
});

export const Admission = model<TCourse>('Admission', courseSchema);
