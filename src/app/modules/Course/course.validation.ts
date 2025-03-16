import { z } from 'zod';

const createCourseValidationSchema = z.object({
  body: z.object({
    shortDescription: z.string(),
    title: z.string(),
    language: z.string(),
    durationInMinutes: z.string(),
    price: z.string(),
    description: z.string(),
    level: z.string(),
    featured: z.boolean(),
    numberOfLectures: z.string(),
    discountPrice: z.string(),
    isDiscount: z.boolean(),
    videoUrl: z.string(),
    fileUrl: z.string(),
    createdBy: z.string(),
  }),
});

const updatePreRequisiteCourseValidationSchema = z.object({
  course: z.string(),
  isDeleted: z.boolean().optional(),
});

const updateCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    prefix: z.string().optional(),
    code: z.number().optional(),
    credits: z.number().optional(),
    preRequisiteCourses: z
      .array(updatePreRequisiteCourseValidationSchema)
      .optional(),
    isDeleted: z.boolean().optional(),
  }),
});

const facultiesWithCourseValidationSchema = z.object({
  body: z.object({
    faculties: z.array(z.string()),
  }),
});

export const CourseValidations = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
  facultiesWithCourseValidationSchema,
};
