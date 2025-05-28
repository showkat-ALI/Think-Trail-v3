import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AssignmentServices } from './assingments.service';

const uploadFile = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new Error('File is missing in the request');
  }
  const result = await AssignmentServices.createAssignmentFileIntoDB(req.file);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'File uploaded successfully',
    data: result,
  });
});
const uploadModuleVideo = catchAsync(async (req, res) => {
  const result = await AssignmentServices.createModuleVideoIntoDB(req.file);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'File uploaded successfully',
    data: result,
  });
});
const createAssignment = catchAsync(async (req, res) => {
  const result = await AssignmentServices.createAssignmentIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assignment uploaded successfully',
    data: result,
  });
});
const getAssignmentsByInstructor = catchAsync(async (req, res) => {
  const result =
    await AssignmentServices.getAllAssignementsByInstructorfromDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assignment retrived successfully',
    data: result,
  });
});
const getSingleAssignment = catchAsync(async (req, res) => {
  const {id}=req.params
  const result =
    await AssignmentServices.getSingleAssingment(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assignment retrived successfully',
    data: result,
  });
});
const submitAssignment = catchAsync(async (req, res) => {
  const result = await AssignmentServices.submitAssignmentIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assignment uploaded successfully',
    data: result,
  });
});
const getAllSubmittedAssignments = catchAsync(async (req, res) => {
  const result =
    await AssignmentServices.getAllSubmittedAssignments();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assignment retrived successfully',
    data: result,
  });
});
const getSingleSubmitAssignment = catchAsync(async (req, res) => {
  
  const result =
    await AssignmentServices.getSingleSubmittedAssignment(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assignment retrived successfully',
    data: result,
  });
});
const getAllInsSubAssignments = catchAsync(async (req, res) => {
  
  const result =
    await AssignmentServices.getAllInsSubAssignmentsFromDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assignment retrived successfully',
    data: result,
  });
});


export const AssignmentControllers = {
  uploadFile,
  createAssignment,
  getAssignmentsByInstructor,
  uploadModuleVideo,
  getSingleAssignment,
  submitAssignment,
  getAllSubmittedAssignments,
  getSingleSubmitAssignment,
  getAllInsSubAssignments
};
