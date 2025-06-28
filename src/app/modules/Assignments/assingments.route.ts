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
  auth([ 'superAdmin',"student","admin","admitted"]),
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
router.delete(
  '/deleteOneAssignment/:id',
  auth(['admin', 'superAdmin',"student","admitted"]),
  AssignmentControllers.deleteSingleAssignment,
)
router.post(
  "/submit-assignment",
  auth(["student","admitted","admin","superAdmin"]),
  validateRequest(AssignmentValidation.createAssignmentSubmitValidation),
  AssignmentControllers.submitAssignment
)
router.get(
  '/submit-assignment/all-submitted-assignments',
  // auth(["admin", "superAdmin","student","admitted"]),
  AssignmentControllers.getAllSubmittedAssignments,
);
router.get(
  '/submit-assignment/single-assignment/:id/:studentId',
  // auth(["admin", "superAdmin","student","admitted"]),
  AssignmentControllers.getSingleSubmitAssignment,
);
router.get(
  '/studentSubAssignments/:id',
  // auth(["admin", "superAdmin","student","admitted"]),
  AssignmentControllers.getAllInsSubAssignments,
);
router.post(
  '/assignment-marking/:id',
  auth(["admin", "superAdmin"]),

  AssignmentControllers.postAssignmentMark,
);
export const AssignmentRoutes = router;
