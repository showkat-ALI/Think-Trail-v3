import { z } from 'zod';

const createQuizValidation = z.object({
  body: z.object({
    attempts: z.string(),
    isRequired: z.boolean(),
    isSort: z.boolean(),
    questionPerPage: z.string(),
    scorePerQuestion: z.string(),
    startDate: z.string(),
    startTime: z.string(),
    timeAllowed: z.string(),
    title: z.string(),
    type: z.string(),
    createdBy: z.string(),
  }),
});
const submitQuizValidation = z.object({
  body: z.object({
    quiz: z.string(),
    course: z.string(),
    answers: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    ),
    score: z.number(),
    totalQuestions: z.number(),
    submittedBy: z.object({
      name: z.string(),
      email: z.string(),
    }),
  }),
});
export const QuizValidation = {
  createQuizValidation,
  submitQuizValidation
};
