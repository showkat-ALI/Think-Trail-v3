import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CourseControllers } from './course.controller';
import { CourseValidations } from './course.validation';

const router = express.Router();

router.post(
  '/create-course',
  auth(['admin', 'superAdmin']),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get(
  '/:id',
  auth(['admin', 'faculty', 'instructor', 'student', 'superAdmin']),
  CourseControllers.getSingleCourse,
);

router.get(
  '/',
  auth(['admin', 'faculty', 'instructor', 'student', 'superAdmin']),
  CourseControllers.getAllCourses,
);

export const CourseRoutes = router;
