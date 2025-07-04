/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { upload } from '../../utils/sendImageToCloudinary';
import { createAdminValidationSchema } from '../Admin/admin.validation';
import { createFacultyValidationSchema } from '../Faculty/faculty.validation';
import { createStudentValidationSchema } from '../Student/student.validation';
import { UserControllers } from './user.controller';
import { UserValidation } from './user.validation';
import AppError from '../../errors/AppError';

const router = express.Router();
router.post(
  '/create-student',
  // auth(['superAdmin', 'admin']),
  // upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    if (req?.body?.data) {
      req.body = JSON.parse(req?.body?.data);
    }
    next();
  },
  validateRequest(createStudentValidationSchema),
  UserControllers.createStudent,
);

router.post(
  '/create-faculty',
  auth(['superAdmin', 'admin']),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createFacultyValidationSchema),
  UserControllers.createFaculty,
);

const parseAdminData = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.data) {
    if (req.body.admin) {
      // Handle case where data is already parsed
      return next();
    }
    throw new AppError(400, "Form-data field 'data' is required");
  }

  try {
    const parsed = JSON.parse(req.body.data);
    req.body = {
      ...parsed,
      // Preserve the file reference
      file: req.file 
    };
    next();
  } catch (error) {
    throw new AppError(400, "Invalid JSON in 'data' field");
  }
};

// Usage:
router.post(
  '/create-admin',
  auth(['superAdmin']),
  upload.single('file'),
  parseAdminData,
  validateRequest(createAdminValidationSchema),

  UserControllers.createAdmin
);
router.post(
  '/create-superAdmin',
  auth(['superAdmin']),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createAdminValidationSchema),
  UserControllers.createAdmin,
);

router.post(
  '/change-status/:id',
  auth(['superAdmin', 'admin']),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserControllers.changeStatus,
);

router.get(
  '/me',
  auth(['superAdmin', 'admin', 'faculty', 'student']),
  UserControllers.getMe,
);

export const UserRoutes = router;
