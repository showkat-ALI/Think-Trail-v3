import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CourseControllers } from './module.controller';
import { CourseValidations } from './module.validation';
const router = express.Router();

router.post(
  '/upload-module-video',
  auth(['admin', 'superAdmin']),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get(
  '/get-single-module-video/:id',
  auth(['admin', 'faculty', 'instructor', 'student', 'superAdmin']),
  CourseControllers.getSingleCourse,
);
router.post(
  '/upload-module-assignment',
  auth(['admin', 'superAdmin']),
  validateRequest(CourseValidations.createModuleAssignmentValidation),
  CourseControllers.createCourseAssignment,
);
router.get(
  '/get-single-module-assignments/:id',
  auth(['admin', 'faculty', 'instructor', 'student', 'superAdmin']),
  CourseControllers.getSingleModuleAssignment,
);
router.get(
  '/get-single-module-quiz/:id',
  auth(['admin', 'faculty', 'instructor', 'student', 'superAdmin']),
  CourseControllers.getSingleModuleQuiz,
);
router.post(
  '/add-module-quiz',
  auth(['admin', 'superAdmin',"instructor","student"]),
  validateRequest(CourseValidations.createModuleQuizValidation),

  CourseControllers.createModuleQuiz,
);
// router.get(
//   '/',
//   auth(['admin', 'faculty', 'instructor', 'student', 'superAdmin']),
//   CourseControllers.getAllCourses,
// );

export const ModuleVideoRoutes = router;
