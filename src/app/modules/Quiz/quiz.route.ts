import express from 'express';
import auth from '../../middlewares/auth';
import { QuizControllers } from './quiz.controller';
import { QuizValidation } from './quiz.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/create-quiz',
  auth(['admin', 'superAdmin']),
  validateRequest(QuizValidation.createQuizValidation),
  QuizControllers.createQuiz,
);
router.post(
  '/create-question',
  auth(['admin', 'superAdmin']),
  QuizControllers.createQuestion,
);
router.post(
  '/submit-quiz',
  // auth(['admin', 'superAdmin']),
  validateRequest(QuizValidation.submitQuizValidation),

  QuizControllers.createSubmitQuiz,
);
router.get(
  '/submit-quiz/get-all-sub-Quiz',
  // auth(['admin', 'superAdmin']),
  // validateRequest(QuizValidation.submitQuizValidation),

  QuizControllers.getAllSubQuiz,
);

router.get(
  '/all-question/:userID',
  auth(['admin', 'superAdmin']),
  QuizControllers.getAllQuestionsOfAIns,
);
router.get(
  '/single-quiz-question/:quiz',
  auth(['admin', 'superAdmin',"student"]),
  QuizControllers.getSingleQuizQuestion,
);

export const QuizRoutes = router;
