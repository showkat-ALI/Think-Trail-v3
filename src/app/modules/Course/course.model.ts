import { Schema, model } from 'mongoose';
import { TCourse, TCoursefaculty } from './course.interface';

const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    trim: true,
    required: true,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
  shortDescription: {
    type: String,
    trim: true,
    required: true,
  },

  language: {
    type: String,
    trim: true,
  },
  durationInMinutes: {
    type: String,
  },
  price: {
    type: String,
  },
  description: {
    type: String,
    trim: true,
  },
  level: {
    type: String,
    trim: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  numberOfLectures: {
    type: String,
  },
  discountPrice: {
    type: String,
  },
  isDiscount: {
    type: Boolean,
    default: false,
  },
  fileUrl: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

export const Course = model<TCourse>('Course', courseSchema);

const courseFacultySchema = new Schema<TCoursefaculty>({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    unique: true,
  },
  faculties: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
    },
  ],
});

export const CourseFaculty = model<TCoursefaculty>(
  'CourseFaculty',
  courseFacultySchema,
);
