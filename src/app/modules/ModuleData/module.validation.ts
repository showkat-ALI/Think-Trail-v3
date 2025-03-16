import { z } from 'zod';

const createCourseValidationSchema = z.object({
  body: z.object({
    key: z.string(),
    localVideo: z.string(),
    minutes: z.string(),
    second: z.string(),
    topicName: z.string(),
    youtubeVide: z.string().optional(),
    module: z.string(),
  }),
});
const createModuleAssignmentValidation = z.object({
  body: z.object({
    assignment: z.string(),
    module: z.string(),
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
  createModuleAssignmentValidation,
};
