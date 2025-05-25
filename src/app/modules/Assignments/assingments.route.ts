import express from 'express';
import auth from '../../middlewares/auth';
// import validateRequest from '../../middlewares/validateRequest';
import { AssignmentControllers } from './assignments.controller';
import { AssignmentValidation } from './assingments.validation';
import validateRequest from '../../middlewares/validateRequest';
// import { minioUpload } from '../../minio-config/minioConfig';
import { upload } from '../../utils/sendImageToCloudinary';
// import { CourseValidations } from './assingments.validation';
import { uploadvideo } from './../../utils/sendVideoToCloudinary';

const router = express.Router();

router.post(
  '/upload/upload-any-file',
  auth(['admin', 'superAdmin']),
  // minioUpload.single('file'),
    upload.single('file'),
  
  // validateRequest(CourseValidations.createCourseValidationSchema),
  AssignmentControllers.uploadFile,
);
router.post(
  '/upload/upload-any-Video',
  auth(['admin', 'superAdmin']),
  // minioUpload.single('file'),
  uploadvideo.single('file'),
  
  // validateRequest(CourseValidations.createCourseValidationSchema),
  AssignmentControllers.uploadModuleVideo,
);
router.post(
  '/create-assignment',
  auth(['admin', 'superAdmin']),
  validateRequest(AssignmentValidation.createAssignmentValidation),
  AssignmentControllers.createAssignment,
);
router.get(
  '/all-assignments',
  auth(['admin', 'superAdmin']),
  AssignmentControllers.getAssignmentsByInstructor,
);
router.get(
  '/:id',
  auth(['admin', 'superAdmin',"student","admitted"]),
  AssignmentControllers.getSingleAssignment,
);
router.post(
  "/submit-assignment/:courseId/:assignmentId/:studentId",
  auth(["student","admitted"]),
  validateRequest(AssignmentValidation.createAssignmentSubmitValidation),
  AssignmentControllers.submitAssignment
)
export const AssignmentRoutes = router;
