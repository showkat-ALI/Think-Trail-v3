import { z } from 'zod';

const createCourseValidationSchema = z.object({
  body: z.object({
    semester: z.string().optional(), // Assuming ObjectId is passed as a string
    program: z.string().optional(), // Assuming ObjectId is passed as a string
    id: z.string(),
    email: z.string().email(), // Validates email format
    isDeleted: z.boolean().optional(), // Optional field
    roles: z.array(z.string()), 
    status: z.string().optional(), // Assuming status is a string
    agreeTerms: z.boolean(), // Validates if terms are agreed to    
    // Validates roles as an array of strings
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
