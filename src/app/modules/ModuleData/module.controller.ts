import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './module.service';

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourseIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is created successfully',
    data: result,
  });
});
const createCourseAssignment = catchAsync(async (req, res) => {
  const result = await CourseServices.createAssignmentModuleIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is created successfully',
    data: result,
  });
});

// const getAllCourses = catchAsync(async (req, res) => {
//   const result = await CourseServices.getAllCoursesFromDB(req.query);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Course are retrieved successfully',
//     meta: result.meta,
//     data: result.result,
//   });
// });

const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getSingleCourseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is retrieved succesfully',
    data: result,
  });
});
const getSingleModuleAssignment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getSingleModuleAssignmentFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is retrieved succesfully',
    data: result,
  });
});
const getSingleModuleQuiz = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getSingleModuleQuizFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is retrieved succesfully',
    data: result,
  });
});
const createModuleQuiz = catchAsync(async (req, res) => {
  const result = await CourseServices.createQuizofModule(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'question uploaded successfully',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getSingleCourse,
  createCourseAssignment,
  getSingleModuleAssignment,
  createModuleQuiz,
  getSingleModuleQuiz
  // getAllCourses,
};
