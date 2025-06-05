import { Schema, model } from 'mongoose';
import { TModuleAssignment, TModuleQuiz, TModuleVideo } from './module.interface';

const courseSchema = new Schema<TModuleVideo>({
  key: String,
  localVideo: String,
  minutes: String,
  second: String,
  topicName: String,
  youtubeVide: String,
  module: {
    type: Schema.Types.ObjectId,
    ref: 'Module',
  },
});
const moduleAssignmentSchema = new Schema<TModuleAssignment>({
  assignment: {
    type: Schema.Types.ObjectId,
    ref: 'Assignment',
  },
  module: {
    type: Schema.Types.ObjectId,
    ref: 'Module',
  },
});
const moduleQuizSchema = new Schema<TModuleQuiz>({
  quiz: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
  },
  module: {
    type: Schema.Types.ObjectId,
    ref: 'Module',
  },
});

export const ModuleVideo = model<TModuleVideo>('ModuleVideo', courseSchema);
export const ModuleAssignment = model<TModuleAssignment>(
  'ModuleAssignment',
  moduleAssignmentSchema,
);
export const ModuleQuiz = model<TModuleQuiz>(
  'ModuleQuiz',
  moduleQuizSchema,
);
