import httpStatus from 'http-status';
// import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
// import { CourseSearchableFields } from './Module.constant';
import { ModuleAssignment, ModuleVideo } from './module.model';
import { TModuleAssignment, TModuleVideo } from './module.interface';
import { Module } from '../Module/module.model';

const createCourseIntoDB = async (payload: TModuleVideo) => {
  try {
    // Check if the module exists in the database
    const moduleExists = await Module.findById(payload.module);
    if (!moduleExists) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Module does not exist');
    }

    // Check if the module is marked as deleted
    if (moduleExists.isDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Module is deleted');
    }

    // Create the module video if the module exists and is not deleted
    const result = await ModuleVideo.create(payload);
    return result;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Error creating module video');
  }
};
const createAssignmentModuleIntoDB = async (payload: TModuleAssignment) => {
  try {
    // Check if the module exists in the database
    const moduleExists = await Module.findById(payload.module);
    if (!moduleExists) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Module does not exist');
    }

    // Check if the module is marked as deleted
    if (moduleExists.isDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Module is deleted');
    }

    // Create the module video if the module exists and is not deleted
    const result = await ModuleAssignment.create(payload);
    return result;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Error creating module video');
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
  const result = await ModuleVideo.find({ module: id });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Module video not found');
  }
  return result;
};
const getSingleModuleAssignmentFromDB = async (id: string) => {
  const result = await ModuleAssignment.find({ module: id }).populate(
    'assignment',
    'name',
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Module assignment not found');
  }
  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  // getAllCoursesFromDB,
  getSingleCourseFromDB,
  createAssignmentModuleIntoDB,
  getSingleModuleAssignmentFromDB,
};
