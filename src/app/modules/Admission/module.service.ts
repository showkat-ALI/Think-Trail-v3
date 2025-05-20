import httpStatus from 'http-status';
// import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
// import { CourseSearchableFields } from './Module.constant';
import { TCourse } from './module.interface';
import { Admission } from './module.model';
import { User } from '../user/user.model';

const createCourseIntoDB = async (payload: TCourse) => {
  try {
    const existingAdmission = await Admission.findOne({ email: payload.email });
    if (existingAdmission) {
      throw new AppError(
        httpStatus.CONFLICT,
        'Your admission request is under progress',
      );
    }
    const result = await Admission.create(payload);
    return result;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Error creating course');
  }
};

const getAllCoursesFromDB = async () => {
  const result = await Admission.find()
    .populate('program', 'name') // Assuming 'name' is a field in AcademicDepartment
    .populate('semester', 'name'); // Assuming 'title' is a field in AcademicSemester
  return result;
};
const acceptAdmissionRequestDB = async (id:string) => {
   
  const admission = await Admission.findOne({ _id: id });
  if (!admission) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admission request not found');
  }

  const result = await Admission.updateOne({ id: id }, { $set: { status: "accepted" } });
  await User.findByIdAndUpdate(
   {_id: admission?.id}, // Assuming `userId` is a field in the Admission model
    { $addToSet: { role: "admitted" } }
  );

  return result;
};
const rejectAdmissionRequestDB = async (id:string) => {
   
  const result = await Admission.find({_id:id}).updateOne({}, { status: "rejected" });

  return result
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Admission.find({ _id: id });
  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  acceptAdmissionRequestDB,
  rejectAdmissionRequestDB
};
