import httpStatus from 'http-status';
// import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
// import { CourseSearchableFields } from './Module.constant';
import { TCourse } from './module.interface';
import { Module } from './module.model';

const createCourseIntoDB = async (payload: TCourse) => {
  try {
    const result = await Module.create(payload);
    return result;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Error creating course');
  }
};

// const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
//   const courseQuery = new QueryBuilder(
//     Course.find().populate('preRequisiteCourses.course'),
//     query,
//   )
//     .search(CourseSearchableFields)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const result = await courseQuery.modelQuery;
//   const meta = await courseQuery.countTotal();

//   return {
//     meta,
//     result,
//   };
// };

const getSingleCourseFromDB = async (id: string) => {
  const result = await Module.find({ course: id });
  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  // getAllCoursesFromDB,
  getSingleCourseFromDB,
};
