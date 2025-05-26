import httpStatus from 'http-status';
// import fs from 'fs';
import AppError from '../../errors/AppError';

import { Request } from 'express';
import { Assignment, SubmitAssignment } from './assignments.model';
// import { minioClient } from '../../minio-config/minioConfig';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { v4 as uuidv4 } from 'uuid';
import { sendVideoToCloudinary } from '../../utils/sendVideoToCloudinary';
import { User } from '../user/user.model';
import { Course } from '../Course/course.model';
import mongoose from 'mongoose';

const createAssignmentFileIntoDB = async (file: any) => {
  try {
    if (file) {
      const fileName = uuidv4();
      const path = file?.path;

      //send file to cloudinary
      const { secure_url } = await sendImageToCloudinary(fileName, path);
      return secure_url;
    }
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error uploading file to Cloudinary',
    );
  }
};
const createModuleVideoIntoDB = async (file: any) => {
  try {
    if (file) {
      const fileName = uuidv4();
      const path = file?.path;

      //send file to cloudinary
      const { secure_url } = await sendVideoToCloudinary(fileName, path);
      return secure_url;
    }
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error uploading file to Cloudinary',
    );
  }
};

const createAssignmentIntoDB = async (req: Request) => {
  const data = req.body;
  try {
    // Assuming you have a function to save the assignment data to the database
    const savedAssignment = await Assignment.create(data);
    return { savedAssignment };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error creating assignment in the database',
    );
  }
};
const submitAssignmentIntoDB = async (req:any) => {
  // const { studentId, assignmentId, courseId } = req.params;

  // Validate IDs
  // if (!studentId || !assignmentId || !courseId) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     'studentId, assignmentId, and courseId are required parameters',
  //   );
  // }

  try {
  //   // Check if the assignment exists
  //   const assignmentExists = await Assignment.findById(assignmentId);
  //   if (!assignmentExists) {
  //     throw new AppError(
  //       httpStatus.NOT_FOUND,
  //       'Assignment not found',
  //     );
  //   }

  //   // Check if the student exists (assuming you have a Student model)
  //   const studentExists = await User.findById(studentId);
  //   if (!studentExists) {
  //     throw new AppError(
  //       httpStatus.NOT_FOUND,
  //       'Student not found',
  //     );
  //   }

  //   // Check if the course exists (assuming you have a Course model)
  //   const courseExists = await Course.findById(courseId);
  //   if (!courseExists) {
  //     throw new AppError(
  //       httpStatus.NOT_FOUND,
  //       'Course not found',
  //     );
  //   }

    // Create the submission
    const data = req.body;
    const savedAssignment = await SubmitAssignment.create(data);
    return { savedAssignment };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error creating assignment in the database',
    );
  }
};
const getAllAssignementsByInstructorfromDB = async (req: Request) => {
  const { createdBy } = req.query;

  if (!createdBy) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'createdBy query parameter is required',
    );
  }

  try {
    const assignments = await Assignment.find({ createdBy });
    return { assignments };
  } catch (error) {
    console.error('Error fetching submitted assignments:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching assignment from the database',
    );
  }
};
const getSingleAssingment = async (id:any) => {
  

  if (!id) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'createdBy query parameter is required',
    );
  }

  try {
    const assignments = await Assignment.findById({ _id:id });
    return { assignments };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching assignments from the database',
    );
  }
};
const getAllSubmittedAssignments = async () => {
  try {
    
    // Find all submitted assignments that aren't soft deleted (if you implement soft delete)
   const assignments = await SubmitAssignment.find();
return { assignments }; // Return empty array instead of error

  } catch (error) {

    
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching assignment from the database',
    );
  }
};

export const AssignmentServices = {
  createAssignmentFileIntoDB,
  createAssignmentIntoDB,
  getAllAssignementsByInstructorfromDB,
  createModuleVideoIntoDB,
  getSingleAssingment,
  submitAssignmentIntoDB,
  getAllSubmittedAssignments
};
