import httpStatus from 'http-status';
// import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
// import { CourseSearchableFields } from './Module.constant';
import { ModuleAssignment, ModuleQuiz, ModuleVideo } from './module.model';
import { TModuleAssignment, TModuleVideo } from './module.interface';
import { Module } from '../Module/module.model';
import { Question, Quiz } from '../Quiz/quiz.model';
import { Types } from 'mongoose';

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
const getSingleModuleQuizFromDB = async (id: string) => {
  const moduleQuizzes = await ModuleQuiz.find({ module: id }).populate({
    path: 'quiz',
    model: 'Quiz',
  });

  const result = await Promise.all(
    moduleQuizzes.map(async (moduleQuiz) => {
      const quiz = await Quiz.findById(moduleQuiz.quiz);
      if (quiz) {
        const questions = await Question.find({ quiz: quiz._id });
        return {
          ...moduleQuiz.toObject(),
          quiz: {
            ...quiz.toObject(),
            questions,
          },
        };
      }
      return moduleQuiz;
    })
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Module quiz not found');
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
const createQuizofModule = async (payload:any) => {
  // console.log(payload)
  try {
    // Assuming you have a function to save the assignment data to the database
    const quiz = await Quiz.findById({ _id: new Types.ObjectId(payload.quiz) });
    if (!quiz) {
      throw new AppError(httpStatus.NOT_FOUND, 'Quiz not found');
    }
    if (quiz) {
      const savedQuestion = await ModuleQuiz.create(payload);

      return { savedQuestion };
    }
  } catch (error) {
    // console.log(error)
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error creating Question in the database',
    );
  }
};

export const CourseServices = {
  createCourseIntoDB,
  // getAllCoursesFromDB,
  getSingleCourseFromDB,
  createAssignmentModuleIntoDB,
  getSingleModuleAssignmentFromDB,
  createQuizofModule,
  getSingleModuleQuizFromDB,
};
