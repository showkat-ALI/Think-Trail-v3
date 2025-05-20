import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { CourseSearchableFields } from './course.constant';
import { TCourse } from './course.interface';
import { Course } from './course.model';
import { Admission } from '../Admission/module.model';
import { Admin } from '../Admin/admin.model';

const createCourseIntoDB = async (payload: TCourse) => {
  try {
    // Check the number of courses created by the user
    // const courseCount = await Course.countDocuments({ createdBy: payload.createdBy });
    // if (courseCount >= 5) {
    //   throw new AppError(httpStatus.BAD_REQUEST, 'Maximum course creation limit exceeded');
    // }

    // Create the course if the limit is not exceeded
    const result = await Course.create(payload);
    return result;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Error creating course');
  }
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await courseQuery.modelQuery;
  const meta = await courseQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );
  return result;
};
const getAllmyCourse = async (id: string) => {
  const admission = await Admission.findOne({
    _id: id,
    roles: { $all: ["student", "admitted"] },
    status: "accepted"
  }).populate('program');

if (!admission) {
  throw new AppError(httpStatus.NOT_FOUND, 'Admission not found or not eligible');
}

const admin = await Admin.findOne({
  assignedDepartment: admission?.program,
});
if (!admin) {
  throw new AppError(httpStatus.NOT_FOUND, 'Admin not found for the assigned department');
}

const courses = await Course.find({
  createdBy: "6794fbed665a6c5d163ae7c5",
});

const result = {
  courses
  
};
  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  getAllmyCourse
};
