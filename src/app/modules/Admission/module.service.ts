import httpStatus from 'http-status';
// import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
// import { CourseSearchableFields } from './Module.constant';
import { TCourse } from './module.interface';
import { Admission } from './module.model';

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
  const result = await Admission.find({ course: id });
  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  // getAllCoursesFromDB,
  getSingleCourseFromDB,
};
