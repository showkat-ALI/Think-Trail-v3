import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CourseControllers } from './module.controller';
import { CourseValidations } from './module.validation';

const router = express.Router();

router.post(
  '/create-admission-request',
  auth(['admin', 'superAdmin']),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get(
  '/get-course-module/:id',
  auth(['admin', 'faculty', 'instructor', 'student', 'superAdmin']),
  CourseControllers.getSingleCourse,
);

// router.get(
//   '/',
//   auth(['admin', 'faculty', 'instructor', 'student', 'superAdmin']),
//   CourseControllers.getAllCourses,
// );

export const ModuleRouters = router;
