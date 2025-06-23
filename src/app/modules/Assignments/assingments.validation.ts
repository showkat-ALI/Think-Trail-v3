import {  z } from 'zod';

const createAssignmentValidation = z.object({
  body: z.object({
    name: z.string(),
    description: z.string(),
    fileUrl: z.string(),
    comment: z.string().optional(),
    score: z.string(),
    availFrom: z.string(),
    availUntil: z.string(),
    createdBy: z.string().optional(),
    submissionAttempts: z.string(),
  }),
});
const createAssignmentSubmitValidation = z.object({
  body: z.object({
    fileUrl: z.array(z.object({ fileUrl: z.string().url() })),
    comment: z.string().optional(),
    assignment: z.string(),
    course: z.string(),
    text: z.string(),
    submittedBy: z.string(),
    createdBy: z.string()
  }),
});

export const AssignmentValidation = {
  createAssignmentValidation,
  createAssignmentSubmitValidation
};
