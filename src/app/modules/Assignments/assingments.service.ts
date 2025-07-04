import httpStatus from 'http-status';
// import fs from 'fs';
import AppError from '../../errors/AppError';

import { Request, Express } from 'express';
import { Assignment, SubmitAssignment } from './assignments.model';
// import { minioClient } from '../../minio-config/minioConfig';
import { sendFileToCloudinary,  } from '../../utils/sendImageToCloudinary';
import { v4 as uuidv4 } from 'uuid';
import { sendVideoToCloudinary } from '../../utils/sendVideoToCloudinary';
import mongoose from 'mongoose';
import { User } from '../user/user.model';
import { Student } from '../Student/student.model';
import { Course } from '../Course/course.model';


const createAssignmentFileIntoDB = async (file: Express.Multer.File) => {
  try {
    if (!file) {
      throw new AppError(httpStatus.BAD_REQUEST, 'No file provided');
    }

    const fileName = uuidv4() + getExtension(file.originalname); // Keep original extension
    const localPath = file.path;

    const { url } = await sendFileToCloudinary(fileName, localPath);
    return {  fileUrl: url  }; // Return the file URL in the desired format

  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error uploading file to Cloudinary'
    );
  }
};

// Helper to get original file extension
function getExtension(filename: string): string {
  return '.' + filename.split('.').pop();
}
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
      `Error creating assignment in the database${error}`,
    );
  }
};
const submitAssignmentIntoDB = async (req: Request) => {
  try {
    // Create the submission
    const data = req.body;

    // Validate required fields
    if (!data.submittedBy || !data.course || !data.fileUrl || !data.text) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Missing required fields: submittedBy, course, fileUrl, or text',
      );
    }

    // Ensure fileUrl is an array
    if (!Array.isArray(data.fileUrl)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'fileUrl must be an array',
      );
    }

    // Save the assignment
    const savedAssignment = await SubmitAssignment.create({
      submittedBy: data.submittedBy,
      course: data.course,
      fileUrl: data.fileUrl,
      text: data.text,
      assignment:data.assignment,
      comment: data.comment || '', 
      createdBy:data.createdBy// Optional field
    });

    return { savedAssignment };
  } catch (error) {
    console.log(error)
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
const deleteSingleAssignmentFromDB = async (id:any) => {
  

  if (!id) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'createdBy query parameter is required',
    );
  }

  try {
    const deletedAssignment = await Assignment.findByIdAndDelete({ _id: id });
    if (!deletedAssignment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Assignment not found');
    }
    return { message: 'Assignment deleted successfully', deletedAssignment };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching assignments from the database',
    );
  }
};
const getSingleSubmittedAssignment = async (req:Request) => {
  const {studentId,id}=req.params
  

 

  try {
    const objectId = new mongoose.Types.ObjectId(id);
    const assignment = await Assignment.findById({ _id: objectId });
    const submittedAssignment = await SubmitAssignment.findOne({
      assignment: id,
      submittedBy: studentId,
    }).lean();
    
    if (!submittedAssignment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Submitted assignment not found');
    }
    
    // Now find the User with custom "id" field matching "submittedBy"
    const user = await Student.findOne({ id: submittedAssignment.submittedBy })
      .select(' email  id name') // Only select needed fields
      .lean();
    
    // Attach user info to assignment
    const enrichedAssignment = {
      ...submittedAssignment,
      submittedBy: user || null, // attach user data or null
    };
    
    return { assignment,submittedAssignment,enrichedAssignment };
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching assignment from the database',
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
const getAllInsSubAssignmentsFromDB = async (req:Request) => {
  const { id } = req.params;

  try {
    // Fetch all assignments created by the instructor
    const assignments = await SubmitAssignment.find({ createdBy: id }).lean();

    // Fetch users who submitted assignments
    const submittedByIds = assignments.map(a => a.submittedBy);
    const users = await User.find({ id: { $in: submittedByIds } })
      .select('email roles id')
      .lean();

    // Attach user data to assignments
    const courses = await Course.find({ _id: { $in: assignments.map(a => a.course) } })
      .select('_id title')
      .lean();

    const enrichedAssignments = assignments.map(assignment => ({
      ...assignment,
      submittedBy: users.find(user => user.id === assignment.submittedBy) || null,
      course: courses.find(course => course._id.toString() === assignment.course.toString()) || null,
    }));

    return enrichedAssignments;

  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error fetching assignments from the database',
    );
  }
};
const postAssignmentMarkToDB = async (req: Request) => {
  const { id } = req.params;
  const { grade, mark, inscomment } = req.body;

  if (!id) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'id is missing',
    );
  }

  try {
    // Find the assignment by ID and update the grade, mark, and comment
    const updatedAssignment = await SubmitAssignment.findByIdAndUpdate(
      id,
      { grade, mark, 
        inscomment
       },
      { new: true } // Return the updated document
    );

    if (!updatedAssignment) {
      throw new AppError(httpStatus.NOT_FOUND, 'SubmittedAssignment not found');
    }

    return { updatedAssignment };
  } catch (error) {
    console.error('Error updating assignment:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error updating assignment in the database',
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
  getAllSubmittedAssignments,
  getSingleSubmittedAssignment,
  getAllInsSubAssignmentsFromDB,
  postAssignmentMarkToDB,
  deleteSingleAssignmentFromDB
};
