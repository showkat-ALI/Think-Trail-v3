import { Schema, model } from 'mongoose';
import { TCourse } from './module.interface';

const courseSchema = new Schema<TCourse>({
  name: {
    type: String,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
  quizzes: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
  },
  slides: {
    type: Schema.Types.ObjectId,
    ref: 'Slides',
  },
  videos: {
    type: Schema.Types.ObjectId,
    ref: 'Videos',
  },
  isDeleted:{
    type:Boolean,
    byDefault:false
  }
});

export const Module = model<TCourse>('Module', courseSchema);
