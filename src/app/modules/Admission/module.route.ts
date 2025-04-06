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
  '/my-admission/:id',
  auth(['admin', 'faculty', 'instructor', 'student', 'superAdmin']),
  CourseControllers.getSingleCourse,
);

router.get(
  '/get-all-admission-request',
  auth(['admin', 'faculty', 'instructor', 'student', 'superAdmin']),
  CourseControllers.getAllCourses,
);
router.post(
  '/accept-all-admission-request/:id',
  auth(['admin', 'faculty', 'instructor', 'student', 'superAdmin']),
  CourseControllers.acceptAllAdmissionRequest,
);
router.post(
  '/reject-all-admission-request/:id',
  auth(['admin', 'faculty', 'instructor', 'student', 'superAdmin']),
  CourseControllers.rejectAllAdmissionRequest,
);



export const AdmissionRoutes = router;
